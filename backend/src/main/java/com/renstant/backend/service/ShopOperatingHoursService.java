// package com.renstant.backend.service;

// import com.renstant.backend.dto.ShopOperatingHoursRequest;
// import com.renstant.backend.entity.Shop;
// import com.renstant.backend.entity.ShopOperatingHours;
// import com.renstant.backend.entity.User;
// import com.renstant.backend.exception.ConflictException;
// import com.renstant.backend.repository.ShopOperatingHoursRepository;

// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.time.DayOfWeek;
// import java.util.List;

// @Service
// public class ShopOperatingHoursService {

//     private final ShopOperatingHoursRepository operatingHoursRepository;
//     private final ShopService shopService;

//     public ShopOperatingHoursService(
//             ShopOperatingHoursRepository operatingHoursRepository,
//             ShopService shopService) {

//         this.operatingHoursRepository = operatingHoursRepository;
//         this.shopService = shopService;
//     }

//     public List<ShopOperatingHours> getMyOperatingHours(User owner) {

//         Shop shop = shopService.getMyShop(owner);

//         return operatingHoursRepository
//                 .findByShopIdOrderByDayOfWeek(shop.getId());
//     }

//     @Transactional
//     public ShopOperatingHours saveOperatingHours(
//             ShopOperatingHoursRequest request,
//             User owner) {

//         Shop shop = shopService.getMyShop(owner);

//         if (!request.getClosed()) {

//             if (request.getOpeningTime() == null ||
//                     request.getClosingTime() == null) {

//                 throw new IllegalArgumentException(
//                         "Opening and closing time are required when shop is open");
//             }

//             if (!request.getOpeningTime()
//                     .isBefore(request.getClosingTime())) {

//                 throw new IllegalArgumentException(
//                         "Opening time must be before closing time");
//             }
//         }

//         ShopOperatingHours hours =
//                 operatingHoursRepository
//                         .findByShopIdAndDayOfWeek(
//                                 shop.getId(),
//                                 request.getDayOfWeek())
//                         .orElseGet(ShopOperatingHours::new);

//         hours.setShop(shop);
//         hours.setDayOfWeek(request.getDayOfWeek());
//         hours.setClosed(request.getClosed());

//         if (request.getClosed()) {

//             hours.setOpeningTime(null);
//             hours.setClosingTime(null);

//         } else {

//             hours.setOpeningTime(request.getOpeningTime());
//             hours.setClosingTime(request.getClosingTime());
//         }

//         return operatingHoursRepository.save(hours);
//     }
// }


package com.renstant.backend.service;

import com.renstant.backend.dto.ShopOperatingHoursRequest;
import com.renstant.backend.entity.Shop;
import com.renstant.backend.entity.ShopOperatingHours;
import com.renstant.backend.entity.User;
import com.renstant.backend.exception.ResourceNotFoundException;
import com.renstant.backend.repository.ShopOperatingHoursRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShopOperatingHoursService {

    private final ShopOperatingHoursRepository operatingHoursRepository;
    private final ShopService shopService;

    public ShopOperatingHoursService(
            ShopOperatingHoursRepository operatingHoursRepository,
            ShopService shopService) {

        this.operatingHoursRepository = operatingHoursRepository;
        this.shopService = shopService;
    }

    public List<ShopOperatingHours> getOperatingHours(
            Long shopId,
            User owner) {

        Shop shop = getOwnedShop(shopId, owner);

        return operatingHoursRepository
                .findByShopIdOrderByDayOfWeek(shop.getId());
    }

    @Transactional
    public ShopOperatingHours saveOperatingHours(
            Long shopId,
            ShopOperatingHoursRequest request,
            User owner) {

        Shop shop = getOwnedShop(shopId, owner);

        if (!request.getClosed()) {

            if (request.getOpeningTime() == null ||
                    request.getClosingTime() == null) {

                throw new IllegalArgumentException(
                        "Opening and closing time are required when shop is open");
            }

            if (!request.getOpeningTime()
                    .isBefore(request.getClosingTime())) {

                throw new IllegalArgumentException(
                        "Opening time must be before closing time");
            }
        }

        ShopOperatingHours hours =
                operatingHoursRepository
                        .findByShopIdAndDayOfWeek(
                                shop.getId(),
                                request.getDayOfWeek())
                        .orElseGet(ShopOperatingHours::new);

        hours.setShop(shop);
        hours.setDayOfWeek(request.getDayOfWeek());
        hours.setClosed(request.getClosed());

        if (request.getClosed()) {

            hours.setOpeningTime(null);
            hours.setClosingTime(null);

        } else {

            hours.setOpeningTime(request.getOpeningTime());
            hours.setClosingTime(request.getClosingTime());
        }

        return operatingHoursRepository.save(hours);
    }

    private Shop getOwnedShop(Long shopId, User owner) {

        return shopService.getMyShops(owner)
                .stream()
                .filter(shop -> shop.getId().equals(shopId))
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Shop not found or you are not the owner"));
    }
}
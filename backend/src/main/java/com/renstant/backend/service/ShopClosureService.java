// package com.renstant.backend.service;

// import com.renstant.backend.dto.ShopClosureRequest;
// import com.renstant.backend.entity.Shop;
// import com.renstant.backend.entity.ShopClosure;
// import com.renstant.backend.entity.User;
// import com.renstant.backend.exception.ConflictException;
// import com.renstant.backend.exception.ForbiddenException;
// import com.renstant.backend.exception.ResourceNotFoundException;
// import com.renstant.backend.repository.ShopClosureRepository;
// import com.renstant.backend.repository.ShopRepository;

// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.time.LocalDate;
// import java.util.List;

// @Service
// public class ShopClosureService {

//     private final ShopClosureRepository shopClosureRepository;
//     private final ShopRepository shopRepository;

//     public ShopClosureService(
//             ShopClosureRepository shopClosureRepository,
//             ShopRepository shopRepository) {

//         this.shopClosureRepository = shopClosureRepository;
//         this.shopRepository = shopRepository;
//     }

//     public List<ShopClosure> getMyClosures(User owner) {

//         Shop shop = shopRepository
//         .findByOwnerId(owner.getId())
//         .stream()
//         .findFirst()
//         .orElseThrow(() ->
//                 new ResourceNotFoundException("Shop not found"));

//         return shopClosureRepository
//                 .findByShopIdOrderByStartDate(shop.getId());
//     }

//     @Transactional
//     public ShopClosure createClosure(
//             ShopClosureRequest request,
//             User owner) {

//         Shop shop = shopRepository
//         .findByOwnerId(owner.getId())
//         .stream()
//         .findFirst()
//         .orElseThrow(() ->
//                 new ResourceNotFoundException("Shop not found"));

//         LocalDate startDate = request.getStartDate();
//         LocalDate endDate = request.getEndDate();

//         if (startDate.isAfter(endDate)) {
//             throw new IllegalArgumentException(
//                     "Start date must be before or equal to end date");
//         }

//         boolean overlapping =
//                 shopClosureRepository
//                         .existsByShopIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
//                                 shop.getId(),
//                                 endDate,
//                                 startDate
//                         );

//         if (overlapping) {
//             throw new ConflictException(
//                     "Shop already has a closure during this period");
//         }

//         ShopClosure closure = new ShopClosure();

//         closure.setShop(shop);
//         closure.setStartDate(startDate);
//         closure.setEndDate(endDate);
//         closure.setReason(request.getReason());

//         return shopClosureRepository.save(closure);
//     }

//     @Transactional
//     public void deleteClosure(
//             Long closureId,
//             User owner) {

//         ShopClosure closure =
//                 shopClosureRepository.findById(closureId)
//                         .orElseThrow(() ->
//                                 new ResourceNotFoundException(
//                                         "Shop closure not found"));

//         Long ownerId =
//                 closure.getShop()
//                         .getOwner()
//                         .getId();

//         if (!ownerId.equals(owner.getId())) {
//             throw new ForbiddenException(
//                     "You are not allowed to delete this closure");
//         }

//         shopClosureRepository.delete(closure);
//     }
// }


package com.renstant.backend.service;

import com.renstant.backend.dto.ShopClosureRequest;
import com.renstant.backend.entity.Shop;
import com.renstant.backend.entity.ShopClosure;
import com.renstant.backend.entity.User;
import com.renstant.backend.exception.ConflictException;
import com.renstant.backend.exception.ForbiddenException;
import com.renstant.backend.exception.ResourceNotFoundException;
import com.renstant.backend.repository.ShopClosureRepository;
import com.renstant.backend.repository.ShopRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ShopClosureService {

    private final ShopClosureRepository shopClosureRepository;
    private final ShopRepository shopRepository;

    public ShopClosureService(
            ShopClosureRepository shopClosureRepository,
            ShopRepository shopRepository) {

        this.shopClosureRepository = shopClosureRepository;
        this.shopRepository = shopRepository;
    }

    public List<ShopClosure> getClosures(
            Long shopId,
            User owner) {

        Shop shop = getOwnedShop(shopId, owner);

        return shopClosureRepository
                .findByShopIdOrderByStartDate(shop.getId());
    }

    @Transactional
    public ShopClosure createClosure(
            Long shopId,
            ShopClosureRequest request,
            User owner) {

        Shop shop = getOwnedShop(shopId, owner);

        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(
                    "Start date must be before or equal to end date");
        }

        boolean overlapping =
                shopClosureRepository
                        .existsByShopIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                                shop.getId(),
                                endDate,
                                startDate
                        );

        if (overlapping) {
            throw new ConflictException(
                    "Shop already has a closure during this period");
        }

        ShopClosure closure = new ShopClosure();

        closure.setShop(shop);
        closure.setStartDate(startDate);
        closure.setEndDate(endDate);
        closure.setReason(request.getReason());

        return shopClosureRepository.save(closure);
    }

    @Transactional
    public void deleteClosure(
            Long shopId,
            Long closureId,
            User owner) {

        Shop shop = getOwnedShop(shopId, owner);

        ShopClosure closure =
                shopClosureRepository.findById(closureId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Shop closure not found"));

        if (!closure.getShop().getId().equals(shop.getId())) {
            throw new ForbiddenException(
                    "This closure does not belong to this shop");
        }

        shopClosureRepository.delete(closure);
    }

    private Shop getOwnedShop(
            Long shopId,
            User owner) {

        return shopRepository
                .findById(shopId)
                .filter(shop ->
                        shop.getOwner()
                                .getId()
                                .equals(owner.getId()))
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Shop not found or you are not the owner"));
    }
}
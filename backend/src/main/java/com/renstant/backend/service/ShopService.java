package com.renstant.backend.service;

import com.renstant.backend.dto.CreateShopRequest;
import com.renstant.backend.entity.Shop;
import com.renstant.backend.entity.User;
import com.renstant.backend.exception.ResourceNotFoundException;
import com.renstant.backend.repository.ShopRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopService {

    private final ShopRepository shopRepository;

    public ShopService(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    public Shop createShop(CreateShopRequest request, User owner) {

        Shop shop = new Shop();

        shop.setName(request.getName());
        shop.setDescription(request.getDescription());
        shop.setPhone(request.getPhone());

        shop.setAddressLine(request.getAddressLine());
        shop.setCity(request.getCity());
        shop.setState(request.getState());
        shop.setPincode(request.getPincode());

        shop.setLatitude(request.getLatitude());
        shop.setLongitude(request.getLongitude());

        shop.setOwner(owner);

        return shopRepository.save(shop);
    }

    public List<Shop> getAllShops(String city) {

    if (city != null && !city.isBlank()) {
        return shopRepository.findByCityIgnoreCase(city);
    }

    return shopRepository.findAll();
}

public Shop getShopById(Long id) {

    return shopRepository.findById(id)
            .orElseThrow(() ->
        new ResourceNotFoundException("Shop not found"));
}

public Shop getMyShop(User owner) {

    return shopRepository.findByOwnerId(owner.getId())
            .orElseThrow(() ->
                    new ResourceNotFoundException("Shop not found"));
}
}

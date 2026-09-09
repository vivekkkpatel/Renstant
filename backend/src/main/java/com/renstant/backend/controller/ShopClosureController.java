// package com.renstant.backend.controller;

// import com.renstant.backend.dto.ShopClosureRequest;
// import com.renstant.backend.dto.ShopClosureResponse;
// import com.renstant.backend.entity.ShopClosure;
// import com.renstant.backend.entity.User;
// import com.renstant.backend.service.ShopClosureService;

// import jakarta.validation.Valid;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/shops/my-shop/closures")
// public class ShopClosureController {

//     private final ShopClosureService shopClosureService;

//     public ShopClosureController(
//             ShopClosureService shopClosureService) {

//         this.shopClosureService = shopClosureService;
//     }

//     @GetMapping
//     public ResponseEntity<List<ShopClosureResponse>> getClosures(
//             Authentication authentication) {

//         User owner =
//                 (User) authentication.getPrincipal();

//         List<ShopClosureResponse> response =
//                 shopClosureService
//                         .getMyClosures(owner)
//                         .stream()
//                         .map(this::toResponse)
//                         .toList();

//         return ResponseEntity.ok(response);
//     }

//     @PostMapping
//     public ResponseEntity<ShopClosureResponse> createClosure(
//             @Valid @RequestBody ShopClosureRequest request,
//             Authentication authentication) {

//         User owner =
//                 (User) authentication.getPrincipal();

//         ShopClosure closure =
//                 shopClosureService.createClosure(
//                         request,
//                         owner);

//         return ResponseEntity.ok(toResponse(closure));
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deleteClosure(
//             @PathVariable Long id,
//             Authentication authentication) {

//         User owner =
//                 (User) authentication.getPrincipal();

//         shopClosureService.deleteClosure(id, owner);

//         return ResponseEntity.noContent().build();
//     }

//     private ShopClosureResponse toResponse(
//             ShopClosure closure) {

//         return new ShopClosureResponse(
//                 closure.getId(),
//                 closure.getStartDate(),
//                 closure.getEndDate());
//     }
// }



package com.renstant.backend.controller;

import com.renstant.backend.dto.ShopClosureRequest;
import com.renstant.backend.dto.ShopClosureResponse;
import com.renstant.backend.entity.ShopClosure;
import com.renstant.backend.entity.User;
import com.renstant.backend.service.ShopClosureService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops/{shopId}/closures")
public class ShopClosureController {

    private final ShopClosureService shopClosureService;

    public ShopClosureController(
            ShopClosureService shopClosureService) {

        this.shopClosureService = shopClosureService;
    }

    @GetMapping
    public ResponseEntity<List<ShopClosureResponse>> getClosures(
            @PathVariable Long shopId,
            Authentication authentication) {

        User owner =
                (User) authentication.getPrincipal();

        List<ShopClosureResponse> response =
                shopClosureService
                        .getClosures(shopId, owner)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ShopClosureResponse> createClosure(
            @PathVariable Long shopId,
            @Valid @RequestBody ShopClosureRequest request,
            Authentication authentication) {

        User owner =
                (User) authentication.getPrincipal();

        ShopClosure closure =
                shopClosureService.createClosure(
                        shopId,
                        request,
                        owner);

        return ResponseEntity.ok(toResponse(closure));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClosure(
            @PathVariable Long shopId,
            @PathVariable Long id,
            Authentication authentication) {

        User owner =
                (User) authentication.getPrincipal();

        shopClosureService.deleteClosure(
                shopId,
                id,
                owner);

        return ResponseEntity.noContent().build();
    }

    private ShopClosureResponse toResponse(
            ShopClosure closure) {

        return new ShopClosureResponse(
                closure.getId(),
                closure.getStartDate(),
                closure.getEndDate());
    }
}
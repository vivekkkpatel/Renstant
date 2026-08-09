package com.renstant.backend.controller;

import com.renstant.backend.entity.User;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protected")
    public String protectedEndpoint(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return "Hello " + user.getName()
                + " | Role: " + user.getRole();
    }
}

package com.renstant.backend.dto;

import com.renstant.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private Long userId;
    private String name;
    private String email;
    private UserRole role;
}
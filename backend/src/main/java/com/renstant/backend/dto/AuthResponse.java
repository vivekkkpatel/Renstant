package com.renstant.backend.dto;

import com.renstant.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private UserRole role;
}
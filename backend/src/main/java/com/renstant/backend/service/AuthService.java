package com.renstant.backend.service;

import com.renstant.backend.dto.RegisterRequest;
import com.renstant.backend.entity.User;
import com.renstant.backend.entity.UserRole;
import com.renstant.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.renstant.backend.dto.LoginRequest;
import com.renstant.backend.dto.LoginResponse;
import com.renstant.backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number already registered");
        }

        UserRole role = request.getRole();

        if (role == null) {
            role = UserRole.CUSTOMER;
        }

        if (role == UserRole.ADMIN) {
            throw new IllegalArgumentException("Admin registration is not allowed");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(role);

        user.setPassword(
            passwordEncoder.encode(request.getPassword())
        );

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() ->
                    new IllegalArgumentException("Invalid email or password"));

    if (!passwordEncoder.matches(
            request.getPassword(),
            user.getPassword())) {

        throw new IllegalArgumentException("Invalid email or password");
    }

    String token = jwtService.generateToken(user);

    return new LoginResponse(
            token,
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
    );
}
}
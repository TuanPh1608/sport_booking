package com.booking.controller;

import com.booking.entity.User;
import com.booking.security.JwtService;
import com.booking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;

    /**
     * POST /api/users/register - Đăng ký tài khoản mới
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.createUser(
                request.getFullName(),
                request.getPhoneNumber(),
                request.getPassword(),
                User.UserRole.valueOf(request.getRole().toUpperCase())
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "message", "Đăng ký thành công",
                    "userId", user.getId(),
                    "fullName", user.getFullName()
                ));
        } catch (UserService.UserException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/users/login - Đăng nhập
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.authenticate(
                request.getPhoneNumber(),
                request.getPassword()
            );

            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(Map.of(
                "message", "Đăng nhập thành công",
                "userId", user.getId(),
                "fullName", user.getFullName(),
                "role", user.getRole().name(),
                "token", token
            ));
        } catch (UserService.UserException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/users/{id} - Lấy thông tin user
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "phoneNumber", user.getPhoneNumber(),
                "role", user.getRole().name()
            ));
        } catch (UserService.UserException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DTO Classes
    public static class RegisterRequest {
        private String fullName;
        private String phoneNumber;
        private String password;
        private String role; // CUSTOMER hoặc ADMIN

        // Getters
        public String getFullName() { return fullName; }
        public String getPhoneNumber() { return phoneNumber; }
        public String getPassword() { return password; }
        public String getRole() { return role; }
    }

    public static class LoginRequest {
        private String phoneNumber;
        private String password;

        // Getters
        public String getPhoneNumber() { return phoneNumber; }
        public String getPassword() { return password; }
    }
}

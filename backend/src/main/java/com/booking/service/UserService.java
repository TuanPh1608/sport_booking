package com.booking.service;

import com.booking.entity.User;
import com.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Tạo user mới
     */
    public User createUser(String fullName, String phoneNumber, String password, User.UserRole role) 
            throws UserException {
        validateCreateUserRequest(fullName, phoneNumber, password, role);
        
        // Kiểm tra số điện thoại đã tồn tại chưa
        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            throw new UserException("Số điện thoại đã được đăng ký");
        }

        // Mã hóa password bằng BCrypt
        String hashedPassword = passwordEncoder.encode(password);

        User user = User.builder()
            .fullName(fullName)
            .phoneNumber(phoneNumber)
            .password(hashedPassword)
            .role(role)
            .build();

        return userRepository.save(user);
    }

    /**
     * Xác minh đăng nhập
     */
    public User authenticate(String phoneNumber, String password) throws UserException {
        User user = userRepository.findByPhoneNumber(phoneNumber)
            .orElseThrow(() -> new UserException("Số điện thoại hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UserException("Số điện thoại hoặc mật khẩu không chính xác");
        }

        return user;
    }

    private void validateCreateUserRequest(String fullName, String phoneNumber,
            String password, User.UserRole role) throws UserException {
        if (fullName == null || fullName.trim().length() < 2) {
            throw new UserException("Họ tên phải có ít nhất 2 ký tự");
        }

        if (phoneNumber == null || !phoneNumber.matches("^[0-9]{10,11}$")) {
            throw new UserException("Số điện thoại phải gồm 10 hoặc 11 chữ số");
        }

        if (password == null || password.length() < 8) {
            throw new UserException("Mật khẩu phải có ít nhất 8 ký tự");
        }

        if (role == null) {
            throw new UserException("Vai trò người dùng không hợp lệ");
        }
    }

    /**
     * Lấy user theo ID
     */
    public User getUserById(Long id) throws UserException {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserException("User không tồn tại"));
    }

    public static class UserException extends Exception {
        public UserException(String message) {
            super(message);
        }
    }
}

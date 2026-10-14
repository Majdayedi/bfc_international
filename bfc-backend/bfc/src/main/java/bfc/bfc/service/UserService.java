package bfc.bfc.service;

import bfc.bfc.dto.LoginRequest;
import bfc.bfc.dto.LoginResponse;
import bfc.bfc.dto.UpdateProfileRequest;
import bfc.bfc.entities.User;
import bfc.bfc.config.JwtService;
import bfc.bfc.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public LoginResponse updateProfile(User user, UpdateProfileRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        String newEmail = request.getEmail().trim();
        if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
            throw new IllegalArgumentException("Email is already in use");
        }

        String newPassword = request.getNewPassword();
        if (newPassword != null && !newPassword.trim().isEmpty()) {
            if (newPassword.length() < 6) {
                throw new IllegalArgumentException("New password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        user.setName(request.getName().trim());
        user.setEmail(newEmail);

        User saved = userRepository.save(user);

        // Token carries the email as its subject: issue a fresh one so the
        // current session keeps working after an email change.
        return LoginResponse.builder()
                .token(jwtService.generateToken(saved))
                .name(saved.getName())
                .email(saved.getEmail())
                .build();
    }
}

package bfc.bfc.controller;

import bfc.bfc.dto.LoginResponse;
import bfc.bfc.dto.UpdateProfileRequest;
import bfc.bfc.entities.User;
import bfc.bfc.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user,
                                           @Valid @RequestBody UpdateProfileRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));
        }
        try {
            LoginResponse response = userService.updateProfile(user, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String message = e.getMessage() != null ? e.getMessage() : "Could not update credentials";
            return ResponseEntity.badRequest().body(Map.of("message", message));
        }
    }
}

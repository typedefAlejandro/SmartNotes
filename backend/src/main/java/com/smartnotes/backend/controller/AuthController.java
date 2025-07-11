package com.smartnotes.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartnotes.backend.model.dto.LoginDTO;
import com.smartnotes.backend.model.dto.LoginLocationDTO;
import com.smartnotes.backend.model.dto.RegisterDTO;
import com.smartnotes.backend.model.entity.LoginLocation;
import com.smartnotes.backend.repository.LoginLocationRepository;
import com.smartnotes.backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired private AuthService authService;
    @Autowired private LoginLocationRepository loginLocationRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO dto) {
        authService.register(dto);
        return ResponseEntity.ok(Map.of("message", "Usuário registrado com sucesso!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login, HttpServletRequest request) {
        String token = authService.login(login.getEmail(), login.getPassword(), request);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Header de autorização ausente ou mal formatado"));
        }
        
        String token = authorizationHeader.substring(7);

        try {
            authService.validaToken(token);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Sessão inválida ou expirada"));
        }
    }
    
    @GetMapping("/login-history")
    public ResponseEntity<List<LoginLocationDTO>> getLoginHistory(@RequestParam String email) {
        List<LoginLocation> loginHistory = loginLocationRepository.findByUserEmailOrderByLoginDateTimeDesc(email);
        List<LoginLocationDTO> dtoList = loginHistory.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }
    
    @GetMapping("/my-login-history")
    public ResponseEntity<List<LoginLocationDTO>> getMyLoginHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        List<LoginLocation> loginHistory = loginLocationRepository.findByUserEmailOrderByLoginDateTimeDesc(userEmail);
        List<LoginLocationDTO> dtoList = loginHistory.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }
    
    private LoginLocationDTO convertToDTO(LoginLocation loginLocation) {
        return new LoginLocationDTO(
            loginLocation.getIp(),
            loginLocation.getCity(),
            loginLocation.getRegion(),
            loginLocation.getCountry(),
            loginLocation.getTimezone(),
            loginLocation.getLatitude(),
            loginLocation.getLongitude(),
            loginLocation.getLoginDateTime()
        );
    }
}

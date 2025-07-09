package com.smartnotes.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartnotes.backend.model.dto.LoginDTO;
import com.smartnotes.backend.model.dto.RegisterDTO;
import com.smartnotes.backend.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired private AuthService authService;

     @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO dto) {
        authService.register(dto);
        return ResponseEntity.ok(Map.of("message", "Usuário registrado com sucesso!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        String token = authService.login(login.getEmail(), login.getPassword());
        return ResponseEntity.ok(Map.of("token", token));
    }
}

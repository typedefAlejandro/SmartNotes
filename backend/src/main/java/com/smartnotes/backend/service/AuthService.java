package com.smartnotes.backend.service;

import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartnotes.backend.model.dto.RegisterDTO;
import com.smartnotes.backend.model.entity.LoginLocation;
import com.smartnotes.backend.model.entity.User;
import com.smartnotes.backend.repository.LoginLocationRepository;
import com.smartnotes.backend.repository.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LoginLocationRepository loginLocationRepository;
    
    @Autowired
    private IpInfoService ipInfoService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public void register(RegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(encoder.encode(dto.getPassword()));

        userRepository.save(user);
    }

    public String login(String email, String password, HttpServletRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!new BCryptPasswordEncoder().matches(password, user.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        // Captura IP e geolocalização
        this.saveLoginLocation(user, request);

        return this.gerarTokenJwt(user);
    }
    
    private void saveLoginLocation(User user, HttpServletRequest request) {
        try {
            String clientIp = ipInfoService.extractClientIp(request);
            var ipInfo = ipInfoService.getIpInfo(clientIp);
            
            LoginLocation loginLocation = new LoginLocation();
            loginLocation.setUser(user);
            loginLocation.setIp(clientIp);
            loginLocation.setCity(ipInfo.getCity());
            loginLocation.setRegion(ipInfo.getRegion());
            loginLocation.setCountry(ipInfo.getCountry());
            loginLocation.setTimezone(ipInfo.getTimezone());
            loginLocation.setLoginDateTime(LocalDateTime.now());
            
            // Extrai latitude e longitude se disponível
            if (ipInfo.getLoc() != null && !ipInfo.getLoc().isEmpty()) {
                String[] coords = ipInfo.getLoc().split(",");
                if (coords.length == 2) {
                    try {
                        loginLocation.setLatitude(Double.parseDouble(coords[0].trim()));
                        loginLocation.setLongitude(Double.parseDouble(coords[1].trim()));
                    } catch (NumberFormatException e) {
                        // Ignora erro de parsing das coordenadas
                    }
                }
            }
            
            loginLocationRepository.save(loginLocation);
        } catch (Exception e) {
            // Log do erro mas não falha o login
            System.err.println("Erro ao salvar localização do login: " + e.getMessage());
        }
    }

    private String gerarTokenJwt(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS512, "segredo-super-seguro")
                .compact();
    }

    public void validaToken(String token) {
        Jwts.parser().setSigningKey("segredo-super-seguro").parseClaimsJws(token);
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
            .setSigningKey("segredo-super-seguro")
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
}

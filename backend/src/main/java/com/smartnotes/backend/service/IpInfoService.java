package com.smartnotes.backend.service;

import com.smartnotes.backend.model.dto.IpInfoResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IpInfoService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String IPINFO_API_URL = "https://ipinfo.io/";
    
    public IpInfoResponseDTO getIpInfo(String ip) {
        try {
            String url = IPINFO_API_URL + ip + "/json";
            return restTemplate.getForObject(url, IpInfoResponseDTO.class);
        } catch (Exception e) {
            IpInfoResponseDTO fallback = new IpInfoResponseDTO();
            fallback.setIp(ip);
            return fallback;
        }
    }
    
    public String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
} 
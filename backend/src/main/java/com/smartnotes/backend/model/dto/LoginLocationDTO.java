package com.smartnotes.backend.model.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LoginLocationDTO {
    private String ip;
    private String city;
    private String region;
    private String country;
    private String timezone;
    private Double latitude;
    private Double longitude;
    private LocalDateTime loginDateTime;
    
    public LoginLocationDTO(String ip, String city, String region, String country, 
                           String timezone, Double latitude, Double longitude, LocalDateTime loginDateTime) {
        this.ip = ip;
        this.city = city;
        this.region = region;
        this.country = country;
        this.timezone = timezone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.loginDateTime = loginDateTime;
    }
} 
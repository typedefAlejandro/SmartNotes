package com.smartnotes.backend.model.dto;

import lombok.Data;

@Data
public class IpInfoResponseDTO {
    private String ip;
    private String city;
    private String region;
    private String country;
    private String timezone;
    private String loc; // formato "latitude,longitude"
} 
package com.smartnotes.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "login_locations")
public class LoginLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String ip;

    @Column
    private String city;

    @Column
    private String region;

    @Column
    private String country;

    @Column
    private String timezone;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(name = "login_datetime", nullable = false)
    private LocalDateTime loginDateTime;
} 
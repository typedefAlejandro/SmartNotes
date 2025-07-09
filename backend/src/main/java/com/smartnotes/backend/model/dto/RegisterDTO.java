package com.smartnotes.backend.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}


package com.smartnotes.backend.model.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NoteDTO {
  private Long id;
  @NotBlank
  private Long userId;
  @NotBlank
  private String content;
  private String title;
  private LocalDateTime createdAt;
}

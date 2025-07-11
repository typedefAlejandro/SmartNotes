package com.smartnotes.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartnotes.backend.model.dto.NoteDTO;
import com.smartnotes.backend.repository.NoteRepository;
import com.smartnotes.backend.service.AuthService;
import com.smartnotes.backend.service.NoteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
  @Autowired
  private NoteService noteService;

  @Autowired
  private NoteRepository noteRepository;

  @Autowired
  private AuthService authService;

  @PostMapping("/create")
  public ResponseEntity<NoteDTO> create(
    @RequestBody @Valid NoteDTO note,
    @RequestHeader("Authorization") String authorizationHeader
  ) {
    String token = authorizationHeader.substring(7);
    authService.validaToken(token);
    NoteDTO createdNote = noteRepository.create(note);
    return ResponseEntity.ok(createdNote);
  }

  @PutMapping("/update")
  public ResponseEntity<NoteDTO> update(
    @RequestBody @Valid NoteDTO note,
    @RequestHeader("Authorization") String authorizationHeader
  ) {
    String token = authorizationHeader.substring(7);
    authService.validaToken(token);
    NoteDTO updatedNote = noteRepository.update(note);
    return ResponseEntity.ok(updatedNote);
  }

  @DeleteMapping("/delete")
  public ResponseEntity<Void> delete(
    @RequestParam Long id,
    @RequestHeader("Authorization") String authorizationHeader
  ) {
    String token = authorizationHeader.substring(7);
    authService.validaToken(token);
    noteRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/title")
  public ResponseEntity<List<NoteDTO>> findByUserIdAndTitle(
    @RequestHeader("Authorization") String authorizationHeader,
    @RequestParam Long userId,
    @RequestParam String title
  ) {
    String token = authorizationHeader.substring(7);
    authService.validaToken(token);
    List<NoteDTO> notes = noteService.findByUserIdAndTitle(userId, title);
    return ResponseEntity.ok(notes);
  }
}

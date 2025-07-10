package com.smartnotes.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

  @GetMapping("/find-all")
  public ResponseEntity<?> findAll(
    // @RequestHeader("Authorization") String authorizationHeader
  ) {
    // System.out.println("Authorization Header: " + authorizationHeader);
    // String token = authorizationHeader.substring(7);
    // authService.validaToken(token);
    List<NoteDTO> notes = noteRepository.findAll();
    return ResponseEntity.ok(Map.of("notes", notes));
  }

  @GetMapping("/title")
  public ResponseEntity<List<NoteDTO>> findByUserIdAndTitle(
    @RequestHeader("Authorization") String authorizationHeader,
    @RequestParam Long userId,
    @RequestParam(required = false) String title
  ) {
    String token = authorizationHeader.substring(7);
    authService.validaToken(token);
    List<NoteDTO> notes = noteService.findByUserIdAndTitle(userId, title);
    return ResponseEntity.ok(notes);
  }

  @GetMapping("/content")
  public ResponseEntity<List<NoteDTO>> findByUserIdAndContent(
    @RequestHeader("Authorization") String authorizationHeader,
    @RequestParam Long userId,
    @RequestParam(required = false) String content
  ) {
    String token = authorizationHeader.substring(7);
    authService.validaToken(token);
    List<NoteDTO> notes = noteService.findByUserIdAndContent(userId, content);
    return ResponseEntity.ok(notes);
  }
}

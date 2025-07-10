package com.smartnotes.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartnotes.backend.model.dto.NoteDTO;
import com.smartnotes.backend.model.entity.User;
import com.smartnotes.backend.repository.NoteRepository;
import com.smartnotes.backend.repository.UserRepository;

@Service
public class NoteService {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NoteRepository noteRepository;

  public List<NoteDTO> findByUserIdAndTitle(Long userId, String title) {
    Optional<User> user = userRepository.findById(userId);
    if(!user.isPresent()) throw new RuntimeException("Usuário não encontrado");
    List<NoteDTO> notes = noteRepository.findByUserIdAndTitle(userId, title);
    if(notes == null) return new ArrayList<>();
    return notes;
  }

  public List<NoteDTO> findByUserIdAndContent(Long userId, String content) {
    Optional<User> user = userRepository.findById(userId);
    if(!user.isPresent()) throw new RuntimeException("Usuário não encontrado");
    List<NoteDTO> notes = noteRepository.findByUserIdAndContent(userId, content);
    if(notes == null) return new ArrayList<>();
    return notes;
  }
}

package com.smartnotes.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.smartnotes.backend.model.dto.NoteDTO;
import com.smartnotes.backend.model.entity.Note;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Repository
public class NoteRepository {
  @PersistenceContext
  private EntityManager entityManager;

  @Transactional
  public NoteDTO create(NoteDTO note) {
    String sql =
      "INSERT INTO notes (user_id, content, title, created_at) VALUES (:userId, :content, :title, :createdAt) RETURNING *";
    
    Note newNote = (Note) entityManager.createNativeQuery(sql, Note.class)
      .setParameter("userId", note.getUserId())
      .setParameter("content", note.getContent())
      .setParameter("title", note.getTitle())
      .setParameter("createdAt", LocalDateTime.now())
      .getSingleResult();
    return newNote.toDTO();
  }

  @SuppressWarnings("unchecked")
  public List<NoteDTO> findByUserIdAndTitle(Long userId, String title) {
    String sql = "SELECT * FROM notes WHERE user_id = :userId AND title LIKE :title";
    List<Note> notes = entityManager.createNativeQuery(sql, Note.class)
      .setParameter("userId", userId)
      .setParameter("title", "%" + title + "%")
      .getResultList();
    
    return notes.stream()
      .map(note -> new NoteDTO(note.getId(), note.getUser().getId(), note.getContent(), note.getTitle(), note.getCreatedAt()))
      .collect(Collectors.toList());
  }

  @SuppressWarnings("unchecked")
  public List<NoteDTO> findByUserIdAndContent(Long userId, String content) {
    String sql = "SELECT * FROM notes WHERE user_id = :userId AND content LIKE :content";
    List<Note> notes = entityManager.createNativeQuery(sql, Note.class)
      .setParameter("userId", userId)
      .setParameter("content", "%" + content + "%")
      .getResultList();
    
    return notes.stream()
      .map(note -> new NoteDTO(note.getId(), note.getUser().getId(), note.getContent(), note.getTitle(), note.getCreatedAt()))
      .collect(Collectors.toList());
  }

  @Transactional
  public void deleteById(Long id) {
    String sql = "DELETE FROM notes WHERE id = :id";
    entityManager.createNativeQuery(sql)
      .setParameter("id", id)
      .executeUpdate();
  }

  @Transactional
  public NoteDTO update(NoteDTO note) {
    String sql = "UPDATE notes SET content = :content, title = :title WHERE id = :id RETURNING *";
    Note updatedNote = (Note) entityManager.createNativeQuery(sql, Note.class)
      .setParameter("id", note.getId())
      .setParameter("content", note.getContent())
      .setParameter("title", note.getTitle())
      .getSingleResult();
    return updatedNote.toDTO();
  }
}

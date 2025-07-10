package com.smartnotes.backend.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.smartnotes.backend.model.dto.NoteDTO;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Repository
public class NoteRepository {
  @PersistenceContext
  private EntityManager entityManager;

  @Transactional
  public NoteDTO create(NoteDTO note) {
    String sql = "INSERT INTO notes (user_id, content, title) VALUES (:userId, :content, :title) RETURNING *";
    return (NoteDTO) entityManager.createNativeQuery(sql, NoteDTO.class)
      .setParameter("userId", note.getUserId())
      .setParameter("content", note.getContent())
      .setParameter("title", note.getTitle())
      .getSingleResult();
  }

  @SuppressWarnings("unchecked")
  public List<NoteDTO> findByUserIdAndTitle(Long userId, String title) {
    String sql = "SELECT * FROM notes WHERE user_id = :userId AND title LIKE :title";
    return entityManager.createNativeQuery(sql, NoteDTO.class)
      .setParameter("userId", userId)
      .setParameter("name", "%" + title + "%")
      .getResultList();
  }

  @SuppressWarnings("unchecked")
  public List<NoteDTO> findByUserIdAndContent(Long userId, String content) {
    String sql = "SELECT * FROM notes WHERE user_id = :userId AND content LIKE :content";
    return entityManager.createNativeQuery(sql, NoteDTO.class)
      .setParameter("userId", userId)
      .setParameter("content", "%" + content + "%")
      .getResultList();
  }

  @SuppressWarnings("unchecked")
  public List<NoteDTO> findAll() {
    String sql = "SELECT * FROM notes";
    return entityManager.createNativeQuery(sql, NoteDTO.class).getResultList();
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
    return (NoteDTO) entityManager.createNativeQuery(sql, NoteDTO.class)
      .setParameter("id", note.getId())
      .setParameter("content", note.getContent())
      .setParameter("title", note.getTitle())
      .getSingleResult();
  }
}

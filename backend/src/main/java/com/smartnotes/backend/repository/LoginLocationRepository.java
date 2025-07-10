package com.smartnotes.backend.repository;

import com.smartnotes.backend.model.entity.LoginLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LoginLocationRepository extends JpaRepository<LoginLocation, Long> {
    List<LoginLocation> findByUserIdOrderByLoginDateTimeDesc(Long userId);
    
    @Query("SELECT ll FROM LoginLocation ll JOIN ll.user u WHERE u.email = :email ORDER BY ll.loginDateTime DESC")
    List<LoginLocation> findByUserEmailOrderByLoginDateTimeDesc(@Param("email") String email);
} 
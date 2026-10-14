package com.campusloop.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.campusloop.backend.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    Student findByEmailAndPassword(String email, String password);

    boolean existsByEmail(String email);
}
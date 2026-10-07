package com.campusloop.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusloop.backend.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

}
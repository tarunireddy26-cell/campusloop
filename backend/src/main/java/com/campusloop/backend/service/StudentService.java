package com.campusloop.backend.service;

import org.springframework.stereotype.Service;

import com.campusloop.backend.entity.Student;
import com.campusloop.backend.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student registerStudent(Student student) {
        return studentRepository.save(student);
    }
}
package com.campusloop.backend.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.campusloop.backend.entity.Student;
import com.campusloop.backend.repository.StudentRepository;
import com.campusloop.backend.security.PasswordHasher;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordHasher passwordHasher;

    public StudentService(StudentRepository studentRepository, PasswordHasher passwordHasher) {
        this.studentRepository = studentRepository;
        this.passwordHasher = passwordHasher;
    }

    public Student registerStudent(Student student) {
        if (student == null || student.getEmail() == null || student.getPassword() == null) {
            return null;
        }

        String email = student.getEmail().trim().toLowerCase();
        if (studentRepository.existsByEmail(email)) {
            return null;
        }

        student.setEmail(email);
        student.setName(student.getName() != null ? student.getName().trim() : "Student");
        student.setPassword(passwordHasher.hashPassword(student.getPassword()));

        return studentRepository.save(student);
    }

    public Student loginStudent(String email, String password) {
        if (email == null || password == null) {
            return null;
        }

        String normalizedEmail = email.trim().toLowerCase();
        Optional<Student> studentOpt = studentRepository.findByEmail(normalizedEmail);
        if (studentOpt.isEmpty()) {
            return null;
        }

        Student student = studentOpt.get();
        if (!passwordHasher.verifyPassword(password, student.getPassword())) {
            return null;
        }

        // If legacy plaintext password, upgrade it to PBKDF2 in the database
        if (passwordHasher.isLegacyPlaintext(student.getPassword())) {
            student.setPassword(passwordHasher.hashPassword(password));
            studentRepository.save(student);
        }

        return student;
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}
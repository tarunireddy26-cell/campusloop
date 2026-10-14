package com.campusloop.backend.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusloop.backend.dto.AuthResponse;
import com.campusloop.backend.entity.Student;
import com.campusloop.backend.security.TokenService;
import com.campusloop.backend.service.StudentService;

@RestController
@RequestMapping("/student")
public class StudentController {

    private final StudentService studentService;
    private final TokenService tokenService;

    public StudentController(StudentService studentService, TokenService tokenService) {
        this.studentService = studentService;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
        if (student == null || student.getEmail() == null || student.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required."));
        }
        if (student.getPassword() == null || student.getPassword().length() < 4) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 4 characters."));
        }
        if (student.getName() == null || student.getName().isBlank()) {
            student.setName("Student");
        }

        Student registeredStudent = studentService.registerStudent(student);

        if (registeredStudent == null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered."));
        }

        String token = tokenService.generateToken(registeredStudent.getId(), registeredStudent.getEmail());
        AuthResponse response = new AuthResponse(
                registeredStudent.getId(),
                registeredStudent.getName(),
                registeredStudent.getEmail(),
                token,
                "Account created successfully"
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody Student student) {
        if (student == null || student.getEmail() == null || student.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required."));
        }

        Student loggedInStudent = studentService.loginStudent(
                student.getEmail(),
                student.getPassword()
        );

        if (loggedInStudent == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password."));
        }

        String token = tokenService.generateToken(loggedInStudent.getId(), loggedInStudent.getEmail());
        AuthResponse response = new AuthResponse(
                loggedInStudent.getId(),
                loggedInStudent.getName(),
                loggedInStudent.getEmail(),
                token
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentStudent(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Missing or invalid token."));
        }

        String token = authHeader.substring(7);
        TokenService.TokenPayload payload = tokenService.validateToken(token);
        if (payload == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired token."));
        }

        return studentService.getStudentById(payload.getStudentId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }
}
package com.campusloop.backend;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.campusloop.backend.library.Book;
import com.campusloop.backend.library.BookService;
import com.campusloop.backend.registration.EventRegistrationService;
import com.campusloop.backend.security.PasswordHasher;
import com.campusloop.backend.security.TokenService;

@SpringBootTest(properties = "APP_JWT_SECRET=test-jwt-secret-key-for-automated-tests-only-12345")
class BackendApplicationTests {

    @Autowired
    private PasswordHasher passwordHasher;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EventRegistrationService registrationService;

    @Autowired
    private BookService bookService;

    @Test
    void contextLoads() {
        assertNotNull(passwordHasher);
        assertNotNull(tokenService);
        assertNotNull(registrationService);
        assertNotNull(bookService);
    }

    @Test
    void testPasswordHasherPBKDF2AndLegacyMigration() {
        String rawPassword = "securePassword123";
        String hash = passwordHasher.hashPassword(rawPassword);

        assertTrue(hash.startsWith("PBKDF2:"));
        assertTrue(passwordHasher.verifyPassword(rawPassword, hash));
        assertFalse(passwordHasher.verifyPassword("wrongPassword", hash));
        assertFalse(passwordHasher.isLegacyPlaintext(hash));

        // Test legacy plaintext verification and detection
        String legacyPlaintext = "test123";
        assertTrue(passwordHasher.isLegacyPlaintext(legacyPlaintext));
        assertTrue(passwordHasher.verifyPassword("test123", legacyPlaintext));
        assertFalse(passwordHasher.verifyPassword("wrong", legacyPlaintext));
    }

    @Test
    void testTokenServiceGenerateAndValidate() {
        Long studentId = 42L;
        String email = "student42@campus.edu";

        String token = tokenService.generateToken(studentId, email);
        assertNotNull(token);

        TokenService.TokenPayload payload = tokenService.validateToken(token);
        assertNotNull(payload);
        assertEquals(studentId, payload.getStudentId());
        assertEquals(email, payload.getEmail());

        // Tampered token check
        assertNull(tokenService.validateToken(token + "tampered"));
        assertNull(tokenService.validateToken("invalid.token"));
    }

    @Test
    void testPreventDuplicateEventRegistration() {
        // Student 1 is already registered for Event 1 in the seed database
        assertThrows(IllegalStateException.class, () -> {
            registrationService.registerStudent(1L, 1L);
        });
    }

    @Test
    void testBookReservationAndReturn() {
        // Book 1 is Clean Code
        Book book = bookService.getBookById(1L);
        assertNotNull(book);

        // Reset to available if needed
        bookService.returnBook(1L);
        Book availableBook = bookService.getBookById(1L);
        assertTrue(availableBook.isAvailable());

        // Reserve it
        Book reservedBook = bookService.reserveBook(1L);
        assertFalse(reservedBook.isAvailable());

        // Attempting to reserve again should throw IllegalStateException
        assertThrows(IllegalStateException.class, () -> {
            bookService.reserveBook(1L);
        });

        // Return book
        Book returnedBook = bookService.returnBook(1L);
        assertTrue(returnedBook.isAvailable());
    }
}

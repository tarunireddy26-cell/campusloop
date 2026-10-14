package com.campusloop.backend.registration;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/registrations")
public class EventRegistrationController {

    private final EventRegistrationService registrationService;

    public EventRegistrationController(
            EventRegistrationService registrationService) {

        this.registrationService = registrationService;
    }

    @PostMapping("/student/{studentId}/event/{eventId}")
    public ResponseEntity<?> registerStudent(
            @PathVariable Long studentId,
            @PathVariable Long eventId) {

        try {
            EventRegistration registration = registrationService.registerStudent(studentId, eventId);
            return ResponseEntity.status(HttpStatus.CREATED).body(registration);
        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage(), "duplicate", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Unable to complete event registration."));
        }
    }

    @GetMapping("/student/{studentId}")
    public List<EventRegistration> getStudentRegistrations(
            @PathVariable Long studentId) {

        return registrationService.getStudentRegistrations(studentId);
    }

    @GetMapping("/student/{studentId}/event/{eventId}/status")
    public ResponseEntity<?> checkRegistrationStatus(
            @PathVariable Long studentId,
            @PathVariable Long eventId) {

        boolean registered = registrationService.isStudentRegistered(studentId, eventId);
        return ResponseEntity.ok(Map.of("registered", registered));
    }
}
package com.campusloop.backend.registration;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.campusloop.backend.entity.Event;
import com.campusloop.backend.entity.Student;
import com.campusloop.backend.event.EventRepository;
import com.campusloop.backend.repository.StudentRepository;

@Service
public class EventRegistrationService {

    private final EventRegistrationRepository registrationRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;

    public EventRegistrationService(
            EventRegistrationRepository registrationRepository,
            StudentRepository studentRepository,
            EventRepository eventRepository) {

        this.registrationRepository = registrationRepository;
        this.studentRepository = studentRepository;
        this.eventRepository = eventRepository;
    }

    public EventRegistration registerStudent(Long studentId, Long eventId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        Event event = eventRepository.findById(eventId).orElse(null);

        if (student == null) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        if (event == null) {
            throw new IllegalArgumentException("Event not found with ID: " + eventId);
        }

        if (registrationRepository.existsByStudentIdAndEventId(studentId, eventId)) {
            throw new IllegalStateException("Student is already registered for this event.");
        }

        String today = LocalDate.now().toString();
        EventRegistration registration = new EventRegistration(student, event, today);

        return registrationRepository.save(registration);
    }

    public List<EventRegistration> getStudentRegistrations(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }

    public boolean isStudentRegistered(Long studentId, Long eventId) {
        return registrationRepository.existsByStudentIdAndEventId(studentId, eventId);
    }

    public Optional<EventRegistration> getRegistration(Long studentId, Long eventId) {
        return registrationRepository.findByStudentIdAndEventId(studentId, eventId);
    }
}
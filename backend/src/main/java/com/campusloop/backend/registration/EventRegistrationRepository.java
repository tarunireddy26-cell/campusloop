package com.campusloop.backend.registration;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRegistrationRepository
        extends JpaRepository<EventRegistration, Long> {

    List<EventRegistration> findByStudentId(Long studentId);

    List<EventRegistration> findByEventId(Long eventId);

    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);

    Optional<EventRegistration> findByStudentIdAndEventId(Long studentId, Long eventId);
}
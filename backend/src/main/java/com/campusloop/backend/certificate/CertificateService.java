package com.campusloop.backend.certificate;

import java.util.List;

import org.springframework.stereotype.Service;

import com.campusloop.backend.entity.Event;
import com.campusloop.backend.entity.Student;
import com.campusloop.backend.event.EventRepository;
import com.campusloop.backend.repository.StudentRepository;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;

    public CertificateService(
            CertificateRepository certificateRepository,
            StudentRepository studentRepository,
            EventRepository eventRepository) {

        this.certificateRepository = certificateRepository;
        this.studentRepository = studentRepository;
        this.eventRepository = eventRepository;
    }

    public Certificate addCertificate(
            Long studentId,
            Long eventId,
            String certificateName,
            String certificateUrl,
            String issueDate) {

        Student student = studentRepository.findById(studentId).orElse(null);
        Event event = eventRepository.findById(eventId).orElse(null);

        if (student == null || event == null) {
            return null;
        }

        Certificate certificate = new Certificate(
                student,
                event,
                certificateName,
                certificateUrl,
                issueDate
        );

        return certificateRepository.save(certificate);
    }

    public List<Certificate> getStudentCertificates(Long studentId) {
        return certificateRepository.findByStudentId(studentId);
    }
}
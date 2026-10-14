package com.campusloop.backend.certificate;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping("/student/{studentId}/event/{eventId}")
    public ResponseEntity<?> addCertificate(
            @PathVariable Long studentId,
            @PathVariable Long eventId,
            @RequestBody CertificateRequest request) {

        if (request == null || request.getCertificateName() == null || request.getCertificateName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Certificate name is required."));
        }

        Certificate certificate = certificateService.addCertificate(
                studentId,
                eventId,
                request.getCertificateName(),
                request.getCertificateUrl() != null ? request.getCertificateUrl() : "",
                request.getIssueDate() != null ? request.getIssueDate() : java.time.LocalDate.now().toString()
        );

        if (certificate == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student or Event not found."));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(certificate);
    }

    @GetMapping("/student/{studentId}")
    public List<Certificate> getStudentCertificates(
            @PathVariable Long studentId) {

        return certificateService.getStudentCertificates(studentId);
    }
}
package com.campusloop.backend.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TokenService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    // 7 days in milliseconds
    private static final long EXPIRATION_TIME_MS = 7L * 24 * 60 * 60 * 1000;

    private final String secretKey;

    public TokenService(@Value("${app.security.jwt-secret}") String secretKey) {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("Missing required environment variable: APP_JWT_SECRET. A secure secret key is required at startup.");
        }
        this.secretKey = secretKey;
    }

    public String generateToken(Long studentId, String email) {
        long expiry = System.currentTimeMillis() + EXPIRATION_TIME_MS;
        String payload = studentId + ":" + email + ":" + expiry;
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = sign(encodedPayload);
        return encodedPayload + "." + signature;
    }

    public TokenPayload validateToken(String token) {
        if (token == null || !token.contains(".")) {
            return null;
        }

        String[] parts = token.split("\\.");
        if (parts.length != 2) {
            return null;
        }

        String encodedPayload = parts[0];
        String signature = parts[1];

        String expectedSignature = sign(encodedPayload);
        if (!MessageDigest.isEqual(signature.getBytes(StandardCharsets.UTF_8), expectedSignature.getBytes(StandardCharsets.UTF_8))) {
            return null;
        }

        try {
            String payload = new String(Base64.getUrlDecoder().decode(encodedPayload), StandardCharsets.UTF_8);
            String[] data = payload.split(":");
            if (data.length != 3) {
                return null;
            }

            Long studentId = Long.parseLong(data[0]);
            String email = data[1];
            long expiry = Long.parseLong(data[2]);

            if (System.currentTimeMillis() > expiry) {
                return null; // Expired
            }

            return new TokenPayload(studentId, email);
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hmacBytes);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to calculate HMAC signature", e);
        }
    }

    public static class TokenPayload {
        private final Long studentId;
        private final String email;

        public TokenPayload(Long studentId, String email) {
            this.studentId = studentId;
            this.email = email;
        }

        public Long getStudentId() {
            return studentId;
        }

        public String getEmail() {
            return email;
        }
    }
}

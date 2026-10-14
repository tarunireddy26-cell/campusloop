# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Package the Spring Boot executable JAR
RUN mvn clean package -DskipTests

# Stage 2: Run with lightweight JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add non-root application user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy JAR from builder stage
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Environment variable defaults (override in hosting platform)
ENV PORT=8080 \
    SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/campusloop \
    SPRING_DATASOURCE_USERNAME=root \
    SPRING_DATASOURCE_PASSWORD=secret \
    CORS_ALLOWED_ORIGINS=http://localhost:5173

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

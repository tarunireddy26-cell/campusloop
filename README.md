# CampusLoop — College Activity & Student Portal

CampusLoop is a unified student engagement portal designed for college campuses. It centralizes event discovery, registration tracking, certificate verification, campus library resource management, and a community lost-and-found board.

---

## Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite, React Router 7 | Single Page Application with DM Sans & Plus Jakarta Sans typography, centralized Axios API client, Auth Context |
| **Backend** | Spring Boot 4, Java 21, Spring Data JPA | REST API, PBKDF2 password hashing with legacy migration, HMAC-SHA256 session tokens, configurable CORS |
| **Database** | MySQL 8 | Relational schema for students, events, registrations, certificates, books, and lost items |

---

## Features Implemented & Verified

- **Authentication & Security:**
  - Login & registration connected to Spring Boot (`POST /student/login`, `POST /student/register`).
  - Cryptographically secure **PBKDF2 with HMAC-SHA256** password hashing (65,536 iterations).
  - Transparent migration: legacy plaintext accounts (e.g., `taruni@example.com` / `test123`) authenticate smoothly and are automatically upgraded to PBKDF2 in MySQL.
  - Zero password leakage: sensitive password hashes are excluded from all JSON serialization (`WRITE_ONLY`).
  - HMAC-SHA256 signed bearer tokens with session expiry.

- **Discover Events:**
  - Loads campus events dynamically from MySQL (`GET /events`).
  - Category filtering, date badges, venue, time, registration deadlines, and description previews.

- **Event Details & Registration Flow:**
  - Complete event view loaded by ID (`GET /events/:id`).
  - Event registration with student ID and event ID (`POST /registrations/student/:studentId/event/:eventId`).
  - **Duplicate Prevention:** Checks database prior to insertion, returning HTTP `409 Conflict` with a clean warning if already registered.
  - Interactive registration confirmation modal with activity record confirmation.

- **My Activities:**
  - Displays all events joined by the logged-in student (`GET /registrations/student/:studentId`).
  - Confirmed registration badges, event schedule, and links back to event details.

- **Certificate Wallet:**
  - Displays verified credentials issued to the student (`GET /certificates/student/:studentId`).
  - Interactive credential preview modal with recipient name, verified authority seal, issue date, and external certificate links.

- **Campus Library:**
  - Book catalog loaded from MySQL (`GET /books`) with category filter chips.
  - Real-time book reservation flow (`POST /books/:id/reserve`) that marks books as reserved.
  - Includes a release/return endpoint (`POST /books/:id/return`) for returning titles.

- **Lost & Found Feed:**
  - Community feed displaying found items with pictures, descriptions, locations, and contact info (`GET /lost-found`).
  - Feed-based without search filter (as specifically required).
  - Expandable "Post Found Item" form (`POST /lost-found`) allowing students to report found belongings with instant feed refresh.

- **Student Profile:**
  - Dedicated profile view displaying student name, email, student ID, avatar, and live statistics (activities joined, certificates earned).

- **Navigation & UX:**
  - Active route highlighting in sidebar.
  - Header user menu with student info and logout action.
  - Graceful loading spinners, error banners with retry triggers, and empty states.

---

## Local Development Setup

### 1. Prerequisites
- Java 21 (or 17+)
- Node.js 18+ and npm
- MySQL 8.0+ running locally

### 2. Database Configuration
Ensure MySQL has the `campusloop` database created:
```sql
CREATE DATABASE IF NOT EXISTS campusloop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update your local credentials in `backend/src/main/resources/application.properties` or set environment variables:
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/campusloop"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="YourPasswordHere"
```

### 3. Running the Backend
From the repository root:
```bash
cd backend
./mvnw clean compile
./mvnw spring-boot:run
```
The backend starts on `http://localhost:8080`.

To run backend automated tests:
```bash
./mvnw test
```

### 4. Running the Frontend
From the repository root:
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server starts on `http://localhost:5173`.

---

## Production Build Verification

### Backend JAR Build:
```bash
cd backend
./mvnw clean package -DskipTests
```
Output artifact: `backend/target/backend-0.0.1-SNAPSHOT.jar`

### Frontend Production Build:
```bash
cd frontend
npm run build
```
Output directory: `frontend/dist/`

---

## Practical Deployment Guide

### Recommended Hosting Services
1. **Frontend:** [Vercel](https://vercel.com/), [Netlify](https://netlify.com/), or [Cloudflare Pages](https://pages.cloudflare.com/) (Free tier, global CDN, automated HTTPS).
2. **Backend:** [Render](https://render.com/), [Railway](https://railway.app/), or [AWS App Runner](https://aws.amazon.com/apprunner/) (Containerized Spring Boot runtime).
3. **Database:** [Aiven](https://aiven.io/mysql), [PlanetScale](https://planetscale.com/), or [AWS RDS MySQL](https://aws.amazon.com/rds/mysql/) (Managed MySQL with automated backups and SSL).

---

### Environment Variables Matrix

#### Backend Environment Variables
| Variable | Production Example | Description |
|---|---|---|
| `PORT` | `8080` | Port the Spring Boot application listens on |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://db.host.provider.com:3306/campusloop?sslMode=REQUIRED` | Managed MySQL JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | `campusloop_user` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `[SECURE_DB_PASSWORD]` | Database password (never commit) |
| `CORS_ALLOWED_ORIGINS` | `https://campusloop.yourdomain.com` | Production frontend domain allowed for CORS |
| `APP_JWT_SECRET` | `[LONG_RANDOM_HMAC_SECRET_64_CHARS]` | Secret key used to sign and verify session tokens |

#### Frontend Environment Variables
| Variable | Production Example | Description |
|---|---|---|
| `VITE_API_URL` | `https://api.campusloop.yourdomain.com` | URL pointing to the deployed Spring Boot backend |

---

### Step-by-Step Deployment Instructions

#### Step 1: Deploy MySQL Database
1. Provision a managed MySQL instance (e.g., on Aiven, AWS RDS, or Railway).
2. Connect using your preferred MySQL client and verify connectivity.
3. Hibernate is configured with `spring.jpa.hibernate.ddl-auto=update`, which automatically generates and maintains all required tables (`student`, `event`, `event_registration`, `book`, `certificate`, `lost_item`) on first boot.

#### Step 2: Deploy Spring Boot Backend
##### Using Docker (Render, Railway, or AWS App Runner):
1. Connect your repository to the hosting provider.
2. Select **Docker** deployment with root directory `backend/`.
3. Configure the environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `CORS_ALLOWED_ORIGINS`, `APP_JWT_SECRET`).
4. Trigger the build. The multi-stage `backend/Dockerfile` will compile the code using Eclipse Temurin 21 and run a hardened JRE container under a non-root user.
5. Verify health by curling `https://api.campusloop.yourdomain.com/events`.

#### Step 3: Deploy React Frontend
##### Using Vercel or Netlify:
1. Connect the repository and set the root directory to `frontend/`.
2. Set Build Command: `npm run build`.
3. Set Output Directory: `dist`.
4. Add Environment Variable:
   - `VITE_API_URL` = `https://api.campusloop.yourdomain.com` (Your backend production URL).
5. For SPA routing on Netlify, add a `_redirects` file in `public/` containing:
   ```
   /*    /index.html   200
   ```
   For Vercel, a `vercel.json` rewrite:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
   *(If deploying via Docker, the included `frontend/nginx.conf` already handles SPA routing via `try_files $uri $uri/ /index.html;`)*.
6. Deploy and obtain your production frontend URL (e.g., `https://campusloop.vercel.app`).
7. Update the backend's `CORS_ALLOWED_ORIGINS` with this frontend URL.

---

### Docker Compose Multi-Container Deployment (Alternative)
For VPS hosting (DigitalOcean Droplet, AWS EC2, Linode), run the full stack with a single command:
```bash
# 1. Clone repository
git clone <repo-url>
cd campusloop

# 2. Configure production values in .env
cat <<EOF > .env
DB_ROOT_PASSWORD=StrongDatabasePassword2026!
CORS_ALLOWED_ORIGINS=https://campusloop.yourdomain.com
APP_JWT_SECRET=SuperSecretKeyForSigningTokensInProduction2026!
VITE_API_URL=https://api.campusloop.yourdomain.com
EOF

# 3. Launch all containers
docker compose up -d --build
```

---

### Troubleshooting & Common Gotchas

1. **CORS Errors (`Access-Control-Allow-Origin`):**
   - Check the backend `CORS_ALLOWED_ORIGINS` setting. Ensure there are no trailing slashes (e.g. use `https://campusloop.vercel.app`, NOT `https://campusloop.vercel.app/`).
   - The backend `CorsConfig.java` parses comma-separated lists and applies both `WebMvcConfigurer` and a `CorsFilter` bean to handle all preflight `OPTIONS` requests before Spring security/dispatching.

2. **Database Connectivity on Cloud Providers:**
   - Managed cloud databases (AWS RDS, Aiven) require SSL. Append `?sslMode=REQUIRED` to your `SPRING_DATASOURCE_URL`.
   - Ensure the database security group / firewall allows inbound connections from the backend service IP.

3. **Blank Page on Refresh (404 on Direct Routes):**
   - In React Router SPA applications, refreshing `/discover` or `/events/1` sends a GET request for that subpath to the web server.
   - Ensure Nginx or your static host redirects all 404s back to `index.html` (handled in `nginx.conf`).

4. **Secrets in Source Control:**
   - Root `.gitignore` and `frontend/.gitignore` exclude `.env`, `*.log`, and `target/`. Always inject production credentials through your cloud platform's secure environment variable settings.

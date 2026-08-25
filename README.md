# Mini-Travel-ERP

A full-stack internal Enterprise Resource Planning (ERP) system built for small-to-medium travel agencies. It covers the complete booking lifecycle — from creation by sales staff through confirmation and completion by admins — while providing real-time dashboard insights and a clean, role-based access model.

> Built as a portfolio project to demonstrate end-to-end full-stack development with React + Vite, Node.js + Express, Prisma ORM, and MySQL.

---

## Table of Contents

- [Business Problem](#business-problem)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Frontend Screens](#frontend-screens)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Business Workflow](#business-workflow)
- [Security & Code Quality](#security--code-quality)
- [AI-Assisted Development](#ai-assisted-development)

---

## Business Problem

Travel agencies often operate on spreadsheets, messaging apps, or outdated tools with no central source of truth. This leads to:

- Lost or duplicated bookings
- No visibility into pipeline status (pending → confirmed → completed)
- No audit trail when a booking status changes
- Admin staff having no overview of team activity

**Mini-Travel-ERP** solves this by providing a centralized, role-aware internal system where sales staff can create and manage bookings, and admins can review, approve, and track everything through a real-time dashboard.

---

## Features

### Module 1 — Authentication & Authorization
- Internal user registration (admin-only, no public sign-up)
- JWT-based login with **access token** + **refresh token** rotation
- Refresh tokens stored securely in the database and invalidated on logout
- Role system: `ADMIN`, `SALES`, `OPERATOR`
- `requireAuth` middleware — protects every private route
- `requireAdmin` middleware — restricts destructive or sensitive operations

### Module 2 — Booking Management
- Create, read, update, soft-delete bookings
- Booking statuses: `PENDING` → `CONFIRMED` → `COMPLETED` / `CANCELLED`
- Status change restricted to **admins only**, with mandatory audit log
- Search by customer name, customer email, or tour name (`keyword` query)
- Filter by status (`?status=CONFIRMED`)
- Sort by `created_at` or `travel_date` in either direction
- Pagination via `page` and `limit` query params

### Module 3 — Admin Dashboard
- Total bookings count
- Bookings broken down by status (pending / confirmed / completed / cancelled)
- Total revenue from confirmed and completed bookings
- 5 most recently created bookings

### Module 4 — AI & Business Workflow
- AI tools used throughout development (see [AI-Assisted Development](#ai-assisted-development))
- Clear separation of staff and admin responsibilities in the business workflow

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19 + Vite 8 | SPA UI |
| Routing | React Router v7 | Client-side navigation |
| Data Fetching | TanStack Query v5 | Server state, caching, refetch |
| Forms | React Hook Form | Controlled forms with validation |
| HTTP Client | Axios | API calls with interceptors |
| Backend | Node.js + Express 5 | REST API, business logic |
| ORM | Prisma 6 | Type-safe database access |
| Database | MySQL / MariaDB | Persistent storage |
| Auth | jsonwebtoken + bcrypt | JWT signing, password hashing |
| Validation | Zod | Request body schema validation |
| Security | Helmet, CORS, express-rate-limit | HTTP hardening, rate limiting |
| Logging | Morgan | HTTP request logging |

---

## Architecture

```
mini-travel-erp/
├── frontend/                    # React + Vite SPA
│   └── src/
│       ├── pages/               # LoginPage, DashboardPage, BookingListPage, BookingFormPage
│       ├── components/          # Sidebar, Navbar, BookingTable, BookingModal, Pagination, StatusBadge
│       ├── api/                 # Axios instance and API call functions
│       ├── hooks/               # Custom React hooks (useAuth, etc.)
│       └── store/               # Global state (auth context / zustand)
│
├── backend/                     # Node.js + Express REST API
│   └── src/
│       ├── config/
│       │   └── database.js      # Prisma client singleton
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── booking.routes.js
│       │   └── dashboard.routes.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── booking.controller.js
│       │   └── dashboard.controller.js
│       ├── services/
│       │   ├── auth.service.js
│       │   ├── booking.service.js
│       │   └── dashboard.service.js
│       ├── middlewares/
│       │   ├── auth.middleware.js       # requireAuth, requireAdmin
│       │   ├── validation.middleware.js # Zod-based schema validation
│       │   └── error.middleware.js      # Centralized error handler
│       └── app.js               # Express app setup (middlewares, routes)
│
├── prisma/
│   ├── schema.prisma            # Database schema definition
│   ├── migrations/              # Prisma migration history
│   └── seeders/                 # Seed scripts
│
├── .env.example                 # Environment variable template
└── package.json                 # Root scripts (dev, start, seed)
```

**Design principle:** The backend follows a strict **Route → Controller → Service** separation. Routes declare endpoints and apply middleware. Controllers parse HTTP requests and format responses. Services contain all business logic and database queries via Prisma.

---

## Database Schema

### `users`

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK) | Auto-increment primary key |
| `name` | VARCHAR | User full name |
| `email` | VARCHAR (UNIQUE) | Login email |
| `password` | VARCHAR | bcrypt hashed password |
| `role` | ENUM | `ADMIN`, `SALES`, `OPERATOR` |
| `refresh_token` | TEXT | Stored refresh token (nullable) |
| `created_at` | DATETIME | Account creation time |

### `bookings`

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK) | Auto-increment primary key |
| `customer_name` | VARCHAR | Customer full name |
| `customer_email` | VARCHAR | Customer email (optional) |
| `customer_phone` | VARCHAR | Customer phone number |
| `tour_name` | VARCHAR | Name of the booked tour |
| `total_price` | FLOAT | Booking total price |
| `booking_date` | DATETIME | Date the booking was created |
| `travel_date` | DATETIME | Customer's departure date |
| `status` | ENUM | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED` |
| `notes` | TEXT | Optional internal notes |
| `created_by` | INT (FK) | References `users.id` |
| `created_at` | DATETIME | Record creation timestamp |
| `updated_at` | DATETIME | Last update timestamp (auto-managed) |
| `deleted_at` | DATETIME | Soft delete timestamp (nullable) |

### `booking_status_logs`

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK) | Auto-increment primary key |
| `booking_id` | INT (FK) | References `bookings.id` |
| `old_status` | ENUM | Status before the change (nullable for initial creation) |
| `new_status` | ENUM | Status after the change |
| `changed_by` | INT (FK) | References `users.id` |
| `note` | TEXT | Optional reason for the status change |
| `changed_at` | DATETIME | Timestamp of the change |

> Every status transition — including booking creation — is recorded automatically in `booking_status_logs`. This gives admins a full, immutable audit trail.

---

## API Endpoints

### Auth

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | ❌ | — | Login, receive access + refresh token |
| `POST` | `/api/auth/refresh-token` | ❌ | — | Get new access token using refresh token |
| `GET` | `/api/auth/profile` | ✅ | Any | Get current user profile |
| `POST` | `/api/auth/logout` | ✅ | Any | Invalidate refresh token |
| `POST` | `/api/auth/create-user` | ✅ | Admin | Create a new internal user |

### Bookings

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/bookings` | ✅ | Any | List bookings with search, filter, sort, pagination |
| `GET` | `/api/bookings/:id` | ✅ | Any | Get booking details + status log history |
| `POST` | `/api/bookings` | ✅ | Any | Create a new booking |
| `PATCH` | `/api/bookings/:id` | ✅ | Any | Update booking fields |
| `PATCH` | `/api/bookings/:id/status` | ✅ | Admin | Change booking status (logs automatically) |
| `DELETE` | `/api/bookings/:id` | ✅ | Admin | Soft-delete a booking |

#### Supported Query Parameters for `GET /api/bookings`

```
GET /api/bookings?status=CONFIRMED&page=1&limit=10
GET /api/bookings?keyword=nguyen&sort=travel_date_asc
GET /api/bookings?status=PENDING&keyword=paris&page=2&limit=5
```

| Param | Values | Default |
|---|---|---|
| `status` | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED` | — (all) |
| `keyword` | Any string | — |
| `sort` | `created_at_desc`, `created_at_asc`, `travel_date_desc`, `travel_date_asc` | `created_at_desc` |
| `page` | Integer ≥ 1 | `1` |
| `limit` | Integer 1–100 | `10` |

### Dashboard

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/dashboard/summary` | ✅ | Any | Booking counts by status, revenue, recent bookings |

---

## Frontend Screens

| Screen | Route | Description |
|---|---|---|
| Login | `/login` | Email/password login with error display |
| Dashboard | `/` | Summary stats, revenue, recent bookings table |
| Booking List | `/bookings` | Paginated, searchable, filterable booking table |
| Booking Create | `/bookings/new` | Full booking form with validation |
| Booking Edit | `/bookings/:id/edit` | Pre-filled form for editing an existing booking |

All routes except `/login` are protected by a `PrivateRoute` component that redirects unauthenticated users to the login page.

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- MySQL or MariaDB running locally
- npm or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/tam0721/Mini-Travel-ERP.git
cd Mini-Travel-ERP
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and JWT secrets (see [Environment Variables](#environment-variables)).

### 3. Install backend dependencies

```bash
npm install
```

### 4. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 5. (Optional) Seed the database

```bash
npx prisma db seed
```

### 6. Start the backend server

```bash
npm run dev         # development with nodemon
# or
npm start           # production
```

The API will be available at `http://localhost:3000`.

### 7. Install and start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file at the project root based on `.env.example`:

```env
# Database
DATABASE_URL="mysql://root:password@127.0.0.1:3306/mini_travel_erp"

# JWT
JWT_SECRET="your_strong_access_token_secret"
JWT_REFRESH_SECRET="your_strong_refresh_token_secret"

# Server
PORT=3000
```

> **Security note:** Never commit your `.env` file. It is already in `.gitignore`. The JWT secrets must be long, random strings in production.

---

## Business Workflow

```
Staff logs in
  → Staff creates a booking (status: PENDING)
  → System logs the initial status in booking_status_logs
  → Admin views the booking list and dashboard
  → Admin reviews and changes status to CONFIRMED (with optional note)
  → System records the transition: PENDING → CONFIRMED in audit log
  → Admin marks trip as COMPLETED after travel date
  → Revenue is counted on the dashboard (CONFIRMED + COMPLETED)
  → Admin can CANCEL a booking at any stage (also logged)
  → Admin can soft-delete a booking (hidden from lists, data preserved)
```

This workflow reflects a real internal ERP model where:
- **Staff (SALES/OPERATOR)** focuses on data entry and customer communication
- **Admin** owns the approval and final decision-making pipeline
- Every action leaves an immutable audit trail for accountability

---

## Security & Code Quality

| Measure | Implementation |
|---|---|
| Password hashing | `bcrypt` with salt rounds of 10 |
| JWT signing | `jsonwebtoken` with separate access/refresh secrets |
| JWT in headers | `Authorization: Bearer <token>` pattern |
| Refresh token storage | Stored in DB; invalidated on logout |
| Route protection | `requireAuth` middleware on all private routes |
| Role enforcement | `requireAdmin` middleware on sensitive operations |
| Request validation | `zod` schemas on all POST/PATCH endpoints |
| HTTP hardening | `helmet` sets secure response headers |
| CORS | Configured to allow only the frontend origin |
| Rate limiting | `express-rate-limit` on the `/login` endpoint (10 req / 15 min) |
| Request logging | `morgan` logs all incoming HTTP requests |
| Error handling | Centralized `errorHandler` middleware, consistent JSON responses |
| Soft deletes | Deleted bookings are flagged with `deleted_at`, not physically removed |
| Audit trail | Every status change logged in `booking_status_logs` |
| Secret management | All secrets in `.env`, excluded from Git |

**HTTP Status Codes used:**

| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request (validation errors) |
| `401` | Unauthorized (no/invalid token) |
| `403` | Forbidden (insufficient role) |
| `404` | Not Found |
| `429` | Too Many Requests (rate limit) |
| `500` | Internal Server Error |

---

## AI-Assisted Development

AI tools (primarily GitHub Copilot and Claude) were used throughout the development of this project as a force-multiplier — not as a replacement for engineering judgment.

### Specific ways AI was used:

| Area | How AI helped |
|---|---|
| **Debugging** | Diagnosed Express middleware ordering issues; caught a missing `await` inside Prisma `$transaction` causing a silent failure |
| **Query design** | Suggested using `prisma.$transaction([...])` for parallel count queries on the dashboard endpoint to reduce round-trips |
| **Refactoring** | Identified duplicated Zod schema patterns across routes and refactored them into reusable inline validators |
| **Validation edge cases** | Flagged that `z.coerce.date()` is needed for date fields coming from JSON strings; caught missing `.optional()` in partial update schemas |
| **README** | Drafted and structured this document based on project files and requirements |
| **Code review** | Reviewed auth flow for token rotation logic; identified that refresh token comparison should be strict equality against the stored DB value |
| **Test case generation** | Generated test case scenarios for auth edge cases (expired token, tampered token, missing Bearer prefix, wrong role) |

All generated code was reviewed, tested, and adjusted before being committed. AI served as a **pair programmer**, not an autonomous contributor.

## License

MIT

# ⚙️ FinTrack Backend

The core API for **FinTrack**, designed with a clean, extensible architecture and high-performance persistence. Built with a focus on architectural cleanliness and real-world resilience.

---

## 🏛️ Architectural Metadata

### 🏗️ Design Pattern: Repository Pattern
The backend implements a clear separation of concerns:
-   **Routes**: Definition of API endpoints.
-   **Controllers**: HTTP Request/Response handling.
-   **Services**: Business logic orchestration (validations, idempotency checks).
-   **Repositories**: Direct data access layer (SQLite queries).
-   **Utils**: Reusable helpers (response formatting, custom errors).

### 🛡️ Idempotent Operations (Real-World Resilience)
The `POST /expenses` endpoint is fully idempotent. 
-   **Client-Side Request ID**: Every expense creation request is tagged with a unique `request_id` (UUID).
-   **Server-Side Strategy**: Catching `SQLITE_CONSTRAINT_UNIQUE` errors on the `request_id` field in the `expenses` table.
-   **Benefit**: If an unreliable network causes a retry, the server detects the duplicate `request_id` and safely returns the existing record instead of creating a new one.

---

## 🛠️ Tech Stack Metadata
-   **Runtime**: Node.js
-   **Framework**: Express 5.2 (Future-proofed)
-   **Database**: SQLite via `better-sqlite3` (C++ bindings for speed)
-   **Logging**: Custom Morgan-like request logger.

---

## 🔧 Strategic Choices

### What we chose and why?
-   **Better-SQLite3**: Chosen for its incredible speed and zero-latency local IO. Perfect for high-performance single-server apps.
-   **Global Error Middleware**: A centralized error handler ensures consistent JSON error responses across the entire application.
-   **WAL Mode (Write-Ahead Logging)**: Enabled in SQLite for better concurrency management.

### What we avoided?
-   **Prisma/TypeORM**: Avoided heavy ORMs to maintain zero-startup latency and to demonstrate proficiency in raw SQL optimization.
-   **MongoDB**: Avoided NoSQL because expense data is strictly relational and benefits from SQL's ACID compliance and JOIN capabilities.

---

## 🚀 Deployment Status
-   **Hosting**: Render
-   **Live API**: [https://expense-tracker-api-85d0.onrender.com](https://expense-tracker-api-85d0.onrender.com)

---

## 🚀 Environment Setup

Create a `.env` file in this directory:
```env
PORT=5000
# Node environment
NODE_ENV=development
```

## 🛠️ Scripts
- `npm run dev`: Starts the server with `nodemon`.
- `npm start`: Standard node start.

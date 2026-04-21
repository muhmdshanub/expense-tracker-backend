# Expense Tracker Backend API

A production-ready, minimal Node.js backend for the Expense Tracker application. 

## 🚀 Live Demo
- **Live API Endpoint:** Automatically deployed to Render via GitHub CD. 

## 🛠️ Tech Stack & Persistence Choice
- **Language / Framework:** Node.js + Express.js
- **Database (Persistence):** SQLite (`better-sqlite3`)
  - **Why SQLite?** Given the constraints of the assignment and the requirement for real-world resilience, relying on an in-memory array or JSON file is fragile (prone to race conditions or lost data on dyno restarts). SQLite provides standard ACID features natively without requiring the complex infrastructure overhead of a standalone PostgreSQL instance. It easily handles `UNIQUE` constraints (crucial for idempotency) and complex sorting/filtering natively. We additionally enabled `journal_mode = WAL` to optimize concurrent request scaling.

## 🏗️ Key Design Decisions
1. **Repository Pattern & Layered Architecture:**
   While the application is small, the codebase is split structurally to support maintainability over a long lifespan (Routes -> Controllers -> Services -> Repositories -> Config/DB). This cleanly separates the transport layer (Express UI) from core business logic, preventing spaghetti code.
2. **Idempotency & Network Resilience (Money Handling):** 
   To address flaking network situations (where a client drops connection but the server processes the record and the user retries), the `POST /expenses` endpoint enforces an Idempotency mechanism using a client-generated `request_id`.
   - The database treats `request_id` as a `UNIQUE` identifier.
   - If `SQLITE_CONSTRAINT_UNIQUE` is thrown because of a retry, the Service layer securely intercepts the crash and returns the *existing* Expense object seamlessly. The frontend is agnostic to the failure, preventing duplicate charges/records perfectly.
3. **Structured Error Handling:** 
   Wrapped the app in a unified Error Handling Middleware pipeline and created an `AppError` utility. Used a standardized custom `logger.js` wrapper instead of scattering `console.log` throughout the app.

## ⏳ Trade-offs & What Was Intentionally Left Out (Due to 3.5h Timebox)
- **No ORM (e.g. Prisma, TypeORM):** Kept the bundle extremely lightweight by using raw parameterized SQL. This is faster to setup given the time constraints but trades off auto-generated type safety.
- **No Migration CLI Tool:** The SQLite schema boots explicitly via `CREATE TABLE IF NOT EXISTS` natively on start. Real systems would use semantic migrations (like `knex`).
- **Authentication/Users:** Finance data inherently spans multiple users, but Auth (JWT, Passport.js, tracking `user_id` inside the `expenses` table) was skipped specifically to prioritize fulfilling core criteria.
- **Pagination:** The `GET /expenses` acts gracefully for small datasets, but does not use `OFFSET/LIMIT` yet to keep the eventual Frontend pagination UI simple. 

## 🔌 API Endpoints
### Create Expense
`POST /expenses`
**Body:** `amount` (float), `category` (string), `description` (optional string), `date` (YYYY-MM-DD), `request_id` (UUID - idempotency key).
**Response:** `201 Created` (new) or `200 OK` (retried/idempotent).

### Get Expenses
`GET /expenses`  
**Query Params:** `?category=Food&sort=date_desc`
**Response:** `200 OK` Array of expense objects sorted logically by SQLite.

## 🏃 Getting Started Locally
1. `npm install`
2. `npm run dev` (Runs backend with Nodemon on port 5000)

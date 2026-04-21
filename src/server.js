const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("API is running");
});

// GET /expenses
// Support optional query parameters: category, sort=date_desc
app.get("/expenses", (req, res) => {
  try {
    const { category, sort } = req.query;

    let query = "SELECT * FROM expenses";
    const params = [];

    if (category) {
      query += " WHERE category = ?";
      params.push(category);
    }

    // Default sort is by date descending (newest first)
    if (sort === "date_desc") {
      query += " ORDER BY date DESC";
    } else {
      query += " ORDER BY date DESC"; // default to date_desc anyway for newest first
    }

    const stmt = db.prepare(query);
    const expenses = stmt.all(...params);

    res.json(expenses);
  } catch (error) {
    console.error("GET /expenses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /expenses
// Create a new expense.
// Body: amount, category, description, date, request_id
app.post("/expenses", (req, res) => {
  try {
    const { amount, category, description, date, request_id } = req.body;

    // Basic Validation
    if (amount === undefined || !category || !date) {
      return res.status(400).json({ error: "Amount, category, and date are required" });
    }
    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }
    if (!request_id) {
      return res.status(400).json({ error: "request_id is required for idempotency" });
    }

    const id = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO expenses (id, amount, category, description, date, request_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    try {
      stmt.run(id, amount, category, description, date, request_id);
    } catch (dbError) {
      // Handle SQLite Unique Constraint error for idempotency (retry with same request_id)
      if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE' || dbError.message.includes('UNIQUE constraint failed: expenses.request_id')) {
        // Find existing record and return it (Idempotent success)
        const existingStmt = db.prepare('SELECT * FROM expenses WHERE request_id = ?');
        const existingExpense = existingStmt.get(request_id);
        return res.status(200).json(existingExpense); // 200 instead of 201 to indicate it was already created, but returning the object
      }
      throw dbError; // re-throw if it's another error
    }

    // Fetch the newly created record
    const getStmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
    const newExpense = getStmt.get(id);

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("POST /expenses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Use dynamic port (CRITICAL for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const db = require("../config/db");

class ExpenseRepository {
  async getAll(category, sortDesc) {
    let query = "SELECT * FROM expenses";
    const params = [];

    if (category) {
      query += " WHERE category = ?";
      params.push(category);
    }

    if (sortDesc) {
      query += " ORDER BY date DESC";
    } else {
      query += " ORDER BY date DESC";
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  async getById(id) {
    const stmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
    return stmt.get(id);
  }

  async getByRequestId(request_id) {
    const stmt = db.prepare('SELECT * FROM expenses WHERE request_id = ?');
    return stmt.get(request_id);
  }

  async create({ id, amount, category, description, date, request_id }) {
    const stmt = db.prepare(`
      INSERT INTO expenses (id, amount, category, description, date, request_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, amount, category, description, date, request_id);
    return this.getById(id);
  }
}

module.exports = new ExpenseRepository();

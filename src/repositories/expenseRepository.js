const db = require("../config/db");

class ExpenseRepository {
  async getAll(category, sortDesc, limit = 20, offset = 0, startDate = null, endDate = null) {
    let query = `
      SELECT *, 
             SUM(amount) OVER() as totalAmount, 
             COUNT(*) OVER() as totalCount 
      FROM expenses
    `;
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }
    
    if (startDate) {
      conditions.push("date >= ?");
      params.push(startDate);
    }
    
    if (endDate) {
      conditions.push("date <= ?");
      params.push(endDate);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (sortDesc) {
      query += " ORDER BY date DESC, created_at DESC";
    } else {
      query += " ORDER BY date ASC, created_at ASC";
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    
    if (rows.length === 0) {
      return { items: [], totalAmount: 0, totalCount: 0 };
    }

    const { totalAmount, totalCount } = rows[0];
    const items = rows.map(({ totalAmount, totalCount, ...item }) => item);

    return { items, totalAmount, totalCount };
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

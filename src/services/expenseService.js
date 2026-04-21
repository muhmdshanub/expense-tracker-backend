const expenseRepository = require("../repositories/expenseRepository");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../utils/AppError");

class ExpenseService {
  async getExpenses(category, sort, page = 1, limit = 20, startDate = null, endDate = null) {
    const sortDesc = sort === "date_desc" || !sort; // default to desc
    const offset = (Math.max(1, page) - 1) * limit;
    return await expenseRepository.getAll(category, sortDesc, limit, offset, startDate, endDate);
  }

  async createExpense(data) {
    const { amount, category, description, date, request_id } = data;

    // Validation
    if (amount === undefined || !category || !date) {
      throw new AppError("Amount, category, and date are required", 400);
    }
    if (isNaN(amount) || amount < 0) {
      throw new AppError("Amount must be a positive number", 400);
    }
    if (!request_id) {
      throw new AppError("request_id is required for idempotency", 400);
    }

    const id = uuidv4();

    try {
      const newExpense = await expenseRepository.create({
        id, amount, category, description, date, request_id
      });
      return { expense: newExpense, isNew: true };
    } catch (dbError) {
      // Handle Idempotency
      if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE' || dbError.message.includes('UNIQUE constraint failed: expenses.request_id')) {
        const existingExpense = await expenseRepository.getByRequestId(request_id);
        return { expense: existingExpense, isNew: false };
      }
      throw dbError;
    }
  }
}

module.exports = new ExpenseService();

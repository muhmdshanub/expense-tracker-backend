const expenseService = require("../services/expenseService");
const responseHelper = require("../utils/responseHelper");

class ExpenseController {
  async getExpenses(req, res, next) {
    try {
      const { category, sort } = req.query;
      const expenses = await expenseService.getExpenses(category, sort);
      return responseHelper.success(res, 200, expenses, "Expenses retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async createExpense(req, res, next) {
    try {
      const result = await expenseService.createExpense(req.body);
      const statusCode = result.isNew ? 201 : 200;
      return responseHelper.success(res, statusCode, result.expense, "Expense processed successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExpenseController();

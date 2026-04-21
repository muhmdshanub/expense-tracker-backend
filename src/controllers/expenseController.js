const expenseService = require("../services/expenseService");
const responseHelper = require("../utils/responseHelper");

class ExpenseController {
  async getExpenses(req, res, next) {
    try {
      const { category, sort, page, limit, startDate, endDate } = req.query;
      const result = await expenseService.getExpenses(
        category, 
        sort, 
        parseInt(page) || 1, 
        parseInt(limit) || 20,
        startDate,
        endDate
      );
      return responseHelper.success(res, 200, result, "Expenses retrieved successfully");
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

const LoanService = require('../services/LoanService');

class LoanController {
  async getAllLoans(req, res, next) {
    try {
      const employeeId = req.query.employee_id || null;
      const loans = await LoanService.getAllLoans(employeeId);
      res.json(loans);
    } catch (error) {
      next(error);
    }
  }

  async getLoanById(req, res, next) {
    try {
      const loan = await LoanService.getLoanById(req.params.id);
      res.json(loan);
    } catch (error) {
      if (error.message === 'Loan not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async createLoan(req, res, next) {
    try {
      const loan = await LoanService.createLoan(req.body, req.user, req.clientIp);
      res.status(201).json(loan);
    } catch (error) {
      if (error.message.includes('Required field missing')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  async updateLoan(req, res, next) {
    try {
      const loan = await LoanService.updateLoan(req.params.id, req.body, req.user, req.clientIp);
      res.json(loan);
    } catch (error) {
      if (error.message === 'Loan not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async deleteLoanPayment(req, res, next) {
    try {
      const success = await LoanService.deleteLoanPayment(req.params.id);
      if (success) {
        res.json({ message: 'Loan payment deleted successfully' });
      } else {
        res.status(404).json({ error: 'Loan payment not found' });
      }
    } catch (error) {
      if (error.message === 'Loan payment not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async getLoanStatistics(req, res, next) {
    try {
      const statistics = await LoanService.getLoanStatistics();
      res.json(statistics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LoanController();
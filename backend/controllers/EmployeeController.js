const EmployeeService = require('../services/EmployeeService');

class EmployeeController {
  async getAllEmployees(req, res, next) {
    try {
      const employees = await EmployeeService.getAllEmployees(req.query);
      res.json(employees);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeById(req, res, next) {
    try {
      const employee = await EmployeeService.getEmployeeById(req.params.id);
      res.json(employee);
    } catch (error) {
      if (error.message === 'Employee not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async createEmployee(req, res, next) {
    try {
      const employee = await EmployeeService.createEmployee(req.body, req.user, req.clientIp);
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const employee = await EmployeeService.updateEmployee(req.params.id, req.body, req.user, req.clientIp);
      res.json(employee);
    } catch (error) {
      if (error.message === 'Employee not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async deactivateEmployee(req, res, next) {
    try {
      const success = await EmployeeService.deactivateEmployee(req.params.id, req.user, req.clientIp);
      if (success) {
        res.json({ message: 'Employee deactivated successfully' });
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      if (error.message === 'Employee not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async getEmployeeStatistics(req, res, next) {
    try {
      const statistics = await EmployeeService.getEmployeeStatistics();
      res.json(statistics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
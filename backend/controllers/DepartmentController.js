const DepartmentService = require('../services/DepartmentService');

class DepartmentController {
  async getAllDepartments(req, res, next) {
    try {
      const departments = await DepartmentService.getAllDepartments();
      res.json(departments);
    } catch (error) {
      next(error);
    }
  }

  async getDepartmentById(req, res, next) {
    try {
      const department = await DepartmentService.getDepartmentById(req.params.id);
      res.json(department);
    } catch (error) {
      if (error.message === 'Department not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async createDepartment(req, res, next) {
    try {
      const department = await DepartmentService.createDepartment(req.body, req.user, req.clientIp);
      res.status(201).json(department);
    } catch (error) {
      if (error.message.includes('Required fields missing')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  async updateDepartment(req, res, next) {
    try {
      const department = await DepartmentService.updateDepartment(req.params.id, req.body, req.user, req.clientIp);
      res.json(department);
    } catch (error) {
      if (error.message === 'Department not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Required fields missing')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  async deleteDepartment(req, res, next) {
    try {
      const success = await DepartmentService.deleteDepartment(req.params.id);
      if (success) {
        res.json({ message: 'Department deleted successfully' });
      } else {
        res.status(404).json({ error: 'Department not found' });
      }
    } catch (error) {
      if (error.message === 'Department not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }
}

module.exports = new DepartmentController();
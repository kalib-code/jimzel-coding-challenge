const DepartmentModel = require('../models/DepartmentModel');
const { formatObjectDatesForMySQL } = require('../utilities/dateUtils');

class DepartmentService {
  async getAllDepartments() {
    return await DepartmentModel.findAll();
  }

  async getDepartmentById(id) {
    const departments = await DepartmentModel.findById(id);
    if (departments.length === 0) {
      throw new Error('Department not found');
    }
    return departments[0];
  }

  async createDepartment(data, updatedBy, ipAddress) {
    // Validate required fields
    if (!data.code_id || !data.name) {
      throw new Error('Required fields missing: code_id and name are required');
    }
    
    // Add audit fields
    data.updated_by = updatedBy;
    data.ip_address = ipAddress;

    // Format date fields for MySQL
    const dateFields = [];
    const dateTimeFields = ['created_at', 'updated_at'];
    const formattedData = formatObjectDatesForMySQL(data, dateFields, dateTimeFields);

    const result = await DepartmentModel.create(formattedData);
    return {
      id: result.insertId,
      ...formattedData
    };
  }

  async updateDepartment(id, data, updatedBy, ipAddress) {
    // Check if department exists
    const departments = await DepartmentModel.findById(id);
    if (departments.length === 0) {
      throw new Error('Department not found');
    }
    
    // Validate required fields
    if (!data.code_id || !data.name) {
      throw new Error('Required fields missing: code_id and name are required');
    }
    
    // Add audit fields
    data.updated_by = updatedBy;
    data.ip_address = ipAddress;

    // Format date fields for MySQL
    const dateFields = [];
    const dateTimeFields = ['created_at', 'updated_at'];
    const formattedData = formatObjectDatesForMySQL(data, dateFields, dateTimeFields);

    await DepartmentModel.update(id, formattedData);
    return {
      id: parseInt(id),
      ...formattedData
    };
  }

  async deleteDepartment(id) {
    // Check if department exists
    const departments = await DepartmentModel.findById(id);
    if (departments.length === 0) {
      throw new Error('Department not found');
    }
    
    const result = await DepartmentModel.delete(id);
    return result.affectedRows > 0;
  }
}

module.exports = new DepartmentService();
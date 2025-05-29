const EmployeeModel = require('../models/EmployeeModel');
const { formatObjectDatesForMySQL } = require('../utilities/dateUtils');

class EmployeeService {
  async getAllEmployees(queryParams = {}) {
    if (Object.keys(queryParams).length > 0) {
      return await EmployeeModel.search(queryParams);
    }
    return await EmployeeModel.findAllWithDetails();
  }

  async getEmployeeById(id) {
    const employees = await EmployeeModel.findByIdWithDetails(id);
    if (employees.length === 0) {
      throw new Error('Employee not found');
    }
    return employees[0];
  }

  async createEmployee(data, updatedBy, ipAddress) {
    // Add audit fields
    data.updated_by = updatedBy;
    data.ip_address = ipAddress;

    // Validate required fields
    if (!data.empl_id || !data.first_name || !data.last_name) {
      throw new Error('Required fields missing: empl_id, first_name, and last_name are required');
    }

    // Format date fields for MySQL
    const dateFields = [
      'birthday',
      'date_hired',
      'regularized_date',
      'separated_date',
      'contract_start',
      'contract_end',
      'ctc_date'
    ];
    const dateTimeFields = ['created_at', 'updated_at'];
    const formattedData = formatObjectDatesForMySQL(data, dateFields, dateTimeFields);

    console.log('Formatted data for create:', formattedData);

    const result = await EmployeeModel.create(formattedData);
    const createdEmployee = await EmployeeModel.findById(result.insertId);
    return createdEmployee[0];
  }

  async updateEmployee(id, data, updatedBy, ipAddress) {
    // Check if employee exists
    const employees = await EmployeeModel.findById(id);
    if (employees.length === 0) {
      throw new Error('Employee not found');
    }

    // Add audit fields
    data.updated_by = updatedBy;
    data.ip_address = ipAddress;

    // Remove id from data if present
    delete data.id;

    // Remove calculated fields that aren't actual database columns
    const calculatedFields = [
      'department_name', 'position_title', 'employment_type',
      'bank_name', 'pay_frequency_name', 'rate_type_name'
    ];

    calculatedFields.forEach(field => {
      if (data.hasOwnProperty(field)) {
        delete data[field];
      }
    });

    // Format date fields for MySQL
    const dateFields = [
      'birthday',
      'date_hired',
      'regularized_date',
      'separated_date',
      'contract_start',
      'contract_end',
      'ctc_date'
    ];
    const dateTimeFields = ['created_at', 'updated_at'];
    const formattedData = formatObjectDatesForMySQL(data, dateFields, dateTimeFields);

    console.log('Formatted data for update:', formattedData);

    await EmployeeModel.update(id, formattedData);
    const updatedEmployee = await EmployeeModel.findById(id);
    return updatedEmployee[0];
  }

  async deactivateEmployee(id, updatedBy, ipAddress) {
    // Check if employee exists
    const employees = await EmployeeModel.findById(id);
    if (employees.length === 0) {
      throw new Error('Employee not found');
    }

    const result = await EmployeeModel.deactivate(id, updatedBy, ipAddress);
    return result.affectedRows > 0;
  }

  async getEmployeeStatistics() {
    return await EmployeeModel.getStatistics();
  }
}

module.exports = new EmployeeService();

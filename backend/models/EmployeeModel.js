const BaseModel = require('./BaseModel');

class EmployeeModel extends BaseModel {
  constructor() {
    super('employees');
  }

  async findAllWithDetails() {
    const sql = `
      SELECT e.*, 
        d.name as department_name, 
        p.title as position_title,
        et.name as employment_type
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN employment_types et ON e.employment_type_id = et.id
      ORDER BY e.last_name, e.first_name
    `;
    return await this.query(sql);
  }

  async findByIdWithDetails(id) {
    const sql = `
      SELECT e.*, 
        d.name as department_name, 
        p.title as position_title,
        et.name as employment_type,
        b.name as bank_name,
        pf.name as pay_frequency_name,
        rt.name as rate_type_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN employment_types et ON e.employment_type_id = et.id
      LEFT JOIN banks b ON e.bank_id = b.id
      LEFT JOIN pay_frequencies pf ON e.pay_frequency_id = pf.id
      LEFT JOIN rate_types rt ON e.rate_type_id = rt.id
      WHERE e.id = ?
    `;
    return await this.query(sql, [id]);
  }

  async search(params) {
    let sql = `
      SELECT e.*, 
        d.name as department_name, 
        p.title as position_title,
        et.name as employment_type
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN employment_types et ON e.employment_type_id = et.id
    `;
    
    const conditions = [];
    const queryParams = [];
    
    if (params.department) {
      conditions.push('e.department_id = ?');
      queryParams.push(params.department);
    }
    
    if (params.active !== undefined) {
      conditions.push('e.active = ?');
      queryParams.push(params.active === 'true' ? 1 : 0);
    }
    
    if (params.search) {
      conditions.push('(e.first_name LIKE ? OR e.last_name LIKE ? OR e.empl_id LIKE ?)');
      const searchTerm = `%${params.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add conditions to query if they exist
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add ordering
    sql += ' ORDER BY e.last_name, e.first_name';
    
    return await this.query(sql, queryParams);
  }

  async deactivate(id, updatedBy, ipAddress) {
    const sql = 'UPDATE employees SET active = false, updated_by = ?, ip_address = ? WHERE id = ?';
    return await this.query(sql, [updatedBy, ipAddress, id]);
  }

  async getStatistics() {
    const activeEmployees = await this.query('SELECT COUNT(*) as count FROM employees WHERE active = true');
    const departmentDistribution = await this.query(`
      SELECT d.name, COUNT(e.id) as count 
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      WHERE e.active = true
      GROUP BY d.name
      ORDER BY count DESC
    `);
    const employmentTypeDistribution = await this.query(`
      SELECT et.name, COUNT(e.id) as count 
      FROM employees e
      JOIN employment_types et ON e.employment_type_id = et.id
      WHERE e.active = true
      GROUP BY et.name
      ORDER BY count DESC
    `);
    
    return {
      activeEmployees: activeEmployees[0].count,
      departmentDistribution,
      employmentTypeDistribution
    };
  }
}

module.exports = new EmployeeModel();
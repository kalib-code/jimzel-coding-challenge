const BaseModel = require('./BaseModel');

class LoanModel extends BaseModel {
  constructor() {
    super('loans');
  }

  async findAllWithDetails(employeeId = null) {
    let sql = `
      SELECT l.*, 
        e.first_name, e.last_name, e.empl_id,
        lt.name as loan_type_name,
        pf.name as pay_frequency_name
      FROM loans l
      JOIN employees e ON l.employee_id = e.id
      JOIN loan_types lt ON l.loan_type_id = lt.id
      LEFT JOIN pay_frequencies pf ON l.pay_frequency_id = pf.id
    `;
    
    const params = [];
    if (employeeId) {
      sql += ' WHERE l.employee_id = ?';
      params.push(employeeId);
    }
    
    sql += ' ORDER BY l.issue_date DESC';
    
    return await this.query(sql, params);
  }

  async findByIdWithDetails(id) {
    const sql = `
      SELECT l.*, 
        e.first_name, e.last_name, e.empl_id,
        lt.name as loan_type_name,
        pf.name as pay_frequency_name
      FROM loans l
      JOIN employees e ON l.employee_id = e.id
      JOIN loan_types lt ON l.loan_type_id = lt.id
      LEFT JOIN pay_frequencies pf ON l.pay_frequency_id = pf.id
      WHERE l.id = ?
    `;
    
    return await this.query(sql, [id]);
  }

  async getLoanPayments(loanId) {
    return await this.query('SELECT * FROM loan_payments WHERE loan_id = ? ORDER BY payment_date', [loanId]);
  }

  async createLoanPayment(payment) {
    return await this.query(
      'INSERT INTO loan_payments (loan_id, payment_date, amount_paid, remarks, updated_by, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [
        payment.loan_id,
        payment.payment_date,
        payment.amount_paid,
        payment.remarks || null,
        payment.updated_by,
        payment.ip_address
      ]
    );
  }

  async updateLoanPayment(id, payment) {
    return await this.query(
      'UPDATE loan_payments SET payment_date = ?, amount_paid = ?, remarks = ?, updated_by = ?, ip_address = ? WHERE id = ? AND loan_id = ?',
      [
        payment.payment_date,
        payment.amount_paid,
        payment.remarks || null,
        payment.updated_by,
        payment.ip_address,
        id,
        payment.loan_id
      ]
    );
  }

  async deleteLoanPayment(id) {
    return await this.query('DELETE FROM loan_payments WHERE id = ?', [id]);
  }

  async generateLoanAccountId() {
    const loanPrefix = 'LOAN';
    const timestamp = Math.floor(Date.now() / 1000).toString().substr(-6);
    return `${loanPrefix}${timestamp}`;
  }

  async getStatistics() {
    const activeLoans = await this.query('SELECT COUNT(*) as count FROM loans WHERE active = true');
    const totalOutstanding = await this.query('SELECT SUM(running_balance) as total FROM loans WHERE active = true');
    const loanTypeDistribution = await this.query(`
      SELECT lt.name, COUNT(l.id) as count, SUM(l.running_balance) as total_balance
      FROM loans l
      JOIN loan_types lt ON l.loan_type_id = lt.id
      WHERE l.active = true
      GROUP BY lt.name
      ORDER BY total_balance DESC
    `);
    
    return {
      activeLoans: activeLoans[0].count,
      totalOutstanding: totalOutstanding[0].total || 0,
      loanTypeDistribution
    };
  }
}

module.exports = new LoanModel();
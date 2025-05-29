const LoanModel = require('../models/LoanModel');
const { formatObjectDatesForMySQL } = require('../utilities/dateUtils');

class LoanService {
  async getAllLoans(employeeId = null) {
    return await LoanModel.findAllWithDetails(employeeId);
  }

  async getLoanById(id) {
    const loans = await LoanModel.findByIdWithDetails(id);
    if (loans.length === 0) {
      throw new Error('Loan not found');
    }
    
    // Get loan payments
    const payments = await LoanModel.getLoanPayments(id);
    
    // Combine loan and payments
    return {
      ...loans[0],
      payments
    };
  }

  async createLoan(data, updatedBy, ipAddress) {
    // Validate required fields
    const requiredFields = ['employee_id', 'loan_type_id', 'issue_date', 'start_date', 'principal', 'months_to_pay', 'monthly_payment', 'running_balance'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Required field missing: ${field} is required`);
      }
    }
    
    // Generate loan account ID
    const loanAccountId = await LoanModel.generateLoanAccountId();
    
    // Extract payments if included
    const payments = data.payments || [];
    delete data.payments;
    
    // Add audit fields and loan_account_id
    data.updated_by = updatedBy;
    data.ip_address = ipAddress;
    data.loan_account_id = loanAccountId;

    // Format date fields for MySQL
    const dateFields = ['issue_date', 'start_date', 'end_date', 'deduction_start_date'];
    const dateTimeFields = ['created_at', 'updated_at'];
    const formattedData = formatObjectDatesForMySQL(data, dateFields, dateTimeFields);

    console.log('Formatted loan data for create:', formattedData);

    // Create loan
    const result = await LoanModel.create(formattedData);
    const loanId = result.insertId;
    
    // Add payments if provided
    if (payments.length > 0) {
      for (const payment of payments) {
        const paymentData = {
          loan_id: loanId,
          payment_date: payment.payment_date,
          amount_paid: payment.amount_paid,
          remarks: payment.remarks || null,
          updated_by: updatedBy,
          ip_address: ipAddress
        };

        // Format payment date
        const formattedPayment = formatObjectDatesForMySQL(paymentData, ['payment_date'], ['created_at', 'updated_at']);

        await LoanModel.createLoanPayment(formattedPayment);
      }
    }
    
    // Return created loan with payments
    return await this.getLoanById(loanId);
  }

  async updateLoan(id, data, updatedBy, ipAddress) {
    // Check if loan exists
    const loans = await LoanModel.findById(id);
    if (loans.length === 0) {
      throw new Error('Loan not found');
    }

    // Extract payments if included
    const payments = data.payments || [];
    delete data.payments;

    // Add audit fields
    data.updated_by = updatedBy;
    data.ip_address = ipAddress;

    // Remove id from data if present
    delete data.id;

    // Remove calculated fields that aren't actual database columns
    const calculatedFields = [
      'first_name', 'last_name', 'empl_id', 'loan_type_name',
      'pay_frequency_name', 'loan_amount'
    ];

    calculatedFields.forEach(field => {
      if (data.hasOwnProperty(field)) {
        delete data[field];
      }
    });

    // Format date fields for MySQL
    const dateFields = ['issue_date', 'start_date', 'end_date', 'deduction_start_date'];
    const dateTimeFields = ['created_at', 'updated_at'];
    const formattedData = formatObjectDatesForMySQL(data, dateFields, dateTimeFields);

    console.log('Formatted loan data for update:', formattedData);

    // Update loan if there are fields to update
    if (Object.keys(formattedData).length > 2) { // More than just audit fields
      await LoanModel.update(id, formattedData);
    }
    
    // Process payments if provided
    if (payments.length > 0) {
      for (const payment of payments) {
        if (payment.id) {
          // Update existing payment
          const paymentData = {
            loan_id: id,
            payment_date: payment.payment_date,
            amount_paid: payment.amount_paid,
            remarks: payment.remarks || null,
            updated_by: updatedBy,
            ip_address: ipAddress
          };

          // Format payment date
          const formattedPayment = formatObjectDatesForMySQL(paymentData, ['payment_date'], ['created_at', 'updated_at']);

          await LoanModel.updateLoanPayment(payment.id, formattedPayment);
        } else {
          // Add new payment
          const paymentData = {
            loan_id: id,
            payment_date: payment.payment_date,
            amount_paid: payment.amount_paid,
            remarks: payment.remarks || null,
            updated_by: updatedBy,
            ip_address: ipAddress
          };

          // Format payment date
          const formattedPayment = formatObjectDatesForMySQL(paymentData, ['payment_date'], ['created_at', 'updated_at']);

          await LoanModel.createLoanPayment(formattedPayment);
        }
      }
    }
    
    // Return updated loan with payments
    return await this.getLoanById(id);
  }

  async deleteLoanPayment(id) {
    const result = await LoanModel.deleteLoanPayment(id);
    if (result.affectedRows === 0) {
      throw new Error('Loan payment not found');
    }
    return true;
  }

  async getLoanStatistics() {
    return await LoanModel.getStatistics();
  }
}

module.exports = new LoanService();
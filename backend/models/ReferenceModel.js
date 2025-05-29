const BaseModel = require('./BaseModel');

class ReferenceModel {
  constructor() {
    this.positionModel = new BaseModel('positions');
    this.employmentTypeModel = new BaseModel('employment_types');
    this.vendorModel = new BaseModel('vendors');
    this.bankModel = new BaseModel('banks');
    this.payFrequencyModel = new BaseModel('pay_frequencies');
    this.rateTypeModel = new BaseModel('rate_types');
    this.loanTypeModel = new BaseModel('loan_types');
  }

  async getPositions() {
    return await this.positionModel.query('SELECT * FROM positions WHERE active = true ORDER BY title');
  }

  async getEmploymentTypes() {
    return await this.employmentTypeModel.query('SELECT * FROM employment_types ORDER BY name');
  }

  async getVendors() {
    return await this.vendorModel.query('SELECT * FROM vendors WHERE active = true ORDER BY name');
  }

  async getBanks() {
    return await this.bankModel.query('SELECT * FROM banks WHERE active = true ORDER BY name');
  }

  async getPayFrequencies() {
    return await this.payFrequencyModel.query('SELECT * FROM pay_frequencies ORDER BY days_interval');
  }

  async getRateTypes() {
    return await this.rateTypeModel.query('SELECT * FROM rate_types ORDER BY name');
  }

  async getLoanTypes() {
    return await this.loanTypeModel.query('SELECT * FROM loan_types WHERE active = true ORDER BY name');
  }
}

module.exports = new ReferenceModel();
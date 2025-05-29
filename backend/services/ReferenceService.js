const ReferenceModel = require('../models/ReferenceModel');

class ReferenceService {
  async getPositions() {
    return await ReferenceModel.getPositions();
  }

  async getEmploymentTypes() {
    return await ReferenceModel.getEmploymentTypes();
  }

  async getVendors() {
    return await ReferenceModel.getVendors();
  }

  async getBanks() {
    return await ReferenceModel.getBanks();
  }

  async getPayFrequencies() {
    return await ReferenceModel.getPayFrequencies();
  }

  async getRateTypes() {
    return await ReferenceModel.getRateTypes();
  }

  async getLoanTypes() {
    return await ReferenceModel.getLoanTypes();
  }
}

module.exports = new ReferenceService();
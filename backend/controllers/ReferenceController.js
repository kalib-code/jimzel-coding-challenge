const ReferenceService = require('../services/ReferenceService');

class ReferenceController {
  async getPositions(req, res, next) {
    try {
      const positions = await ReferenceService.getPositions();
      res.json(positions);
    } catch (error) {
      next(error);
    }
  }

  async getEmploymentTypes(req, res, next) {
    try {
      const employmentTypes = await ReferenceService.getEmploymentTypes();
      res.json(employmentTypes);
    } catch (error) {
      next(error);
    }
  }

  async getVendors(req, res, next) {
    try {
      const vendors = await ReferenceService.getVendors();
      res.json(vendors);
    } catch (error) {
      next(error);
    }
  }

  async getBanks(req, res, next) {
    try {
      const banks = await ReferenceService.getBanks();
      res.json(banks);
    } catch (error) {
      next(error);
    }
  }

  async getPayFrequencies(req, res, next) {
    try {
      const payFrequencies = await ReferenceService.getPayFrequencies();
      res.json(payFrequencies);
    } catch (error) {
      next(error);
    }
  }

  async getRateTypes(req, res, next) {
    try {
      const rateTypes = await ReferenceService.getRateTypes();
      res.json(rateTypes);
    } catch (error) {
      next(error);
    }
  }

  async getLoanTypes(req, res, next) {
    try {
      const loanTypes = await ReferenceService.getLoanTypes();
      res.json(loanTypes);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReferenceController();
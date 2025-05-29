const request = require('supertest');
const app = require('../../app');

// Mock the ReferenceService to avoid actual database calls
jest.mock('../../services/ReferenceService', () => ({
  getPositions: jest.fn().mockResolvedValue([
    { id: 1, name: 'Manager' },
    { id: 2, name: 'Developer' }
  ]),
  getEmploymentTypes: jest.fn().mockResolvedValue([
    { id: 1, name: 'Full-time' },
    { id: 2, name: 'Part-time' }
  ]),
  getVendors: jest.fn().mockResolvedValue([
    { id: 1, name: 'Vendor A' },
    { id: 2, name: 'Vendor B' }
  ]),
  getBanks: jest.fn().mockResolvedValue([
    { id: 1, name: 'Bank A' },
    { id: 2, name: 'Bank B' }
  ]),
  getPayFrequencies: jest.fn().mockResolvedValue([
    { id: 1, name: 'Weekly' },
    { id: 2, name: 'Bi-weekly' }
  ]),
  getRateTypes: jest.fn().mockResolvedValue([
    { id: 1, name: 'Hourly' },
    { id: 2, name: 'Salary' }
  ]),
  getLoanTypes: jest.fn().mockResolvedValue([
    { id: 1, name: 'Personal' },
    { id: 2, name: 'Car' }
  ])
}));

describe('Reference API Endpoints', () => {
  // Test positions endpoint
  describe('GET /api/positions', () => {
    it('should return all positions', async () => {
      const res = await request(app)
        .get('/api/positions')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Manager');
    });
  });

  // Test employment types endpoint
  describe('GET /api/employment-types', () => {
    it('should return all employment types', async () => {
      const res = await request(app)
        .get('/api/employment-types')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Full-time');
    });
  });

  // Test vendors endpoint
  describe('GET /api/vendors', () => {
    it('should return all vendors', async () => {
      const res = await request(app)
        .get('/api/vendors')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Vendor A');
    });
  });

  // Test banks endpoint
  describe('GET /api/banks', () => {
    it('should return all banks', async () => {
      const res = await request(app)
        .get('/api/banks')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Bank A');
    });
  });

  // Test pay frequencies endpoint
  describe('GET /api/pay-frequencies', () => {
    it('should return all pay frequencies', async () => {
      const res = await request(app)
        .get('/api/pay-frequencies')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Weekly');
    });
  });

  // Test rate types endpoint
  describe('GET /api/rate-types', () => {
    it('should return all rate types', async () => {
      const res = await request(app)
        .get('/api/rate-types')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Hourly');
    });
  });

  // Test loan types endpoint
  describe('GET /api/loan-types', () => {
    it('should return all loan types', async () => {
      const res = await request(app)
        .get('/api/loan-types')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Personal');
    });
  });
});
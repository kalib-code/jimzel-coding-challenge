const request = require('supertest');
const app = require('../../app');

describe('API Endpoints', () => {
  // Test root API endpoint
  describe('GET /api', () => {
    it('should return API information', async () => {
      const res = await request(app)
        .get('/api')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Employee Management System API');
      expect(res.body).toHaveProperty('version', '1.0.0');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  // Test health check endpoint
  describe('GET /api/health', () => {
    it('should return health check information', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('message', 'Server is running');
    });
  });

  // Test endpoints
  describe('GET /api/test', () => {
    it('should return test endpoint information', async () => {
      const res = await request(app)
        .get('/api/test')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Test endpoint');
      expect(res.body).toHaveProperty('method', 'GET');
      expect(res.body).toHaveProperty('timestamp');
    });
  });
});

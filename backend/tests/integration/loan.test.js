const request = require('supertest');
const app = require('../../app');

// Mock the LoanService to avoid actual database calls
jest.mock('../../services/LoanService', () => ({
  getAllLoans: jest.fn().mockResolvedValue([
    { id: 1, employeeId: 1, loanTypeId: 1, amount: 1000, dateApproved: '2023-01-01' },
    { id: 2, employeeId: 2, loanTypeId: 2, amount: 2000, dateApproved: '2023-02-01' }
  ]),
  getLoanById: jest.fn().mockImplementation((id) => {
    if (id === '1') {
      return Promise.resolve({ id: 1, employeeId: 1, loanTypeId: 1, amount: 1000, dateApproved: '2023-01-01' });
    } else {
      return Promise.reject(new Error('Loan not found'));
    }
  }),
  createLoan: jest.fn().mockResolvedValue({ 
    id: 3, 
    employeeId: 1, 
    loanTypeId: 2, 
    amount: 3000, 
    dateApproved: '2023-03-01' 
  }),
  updateLoan: jest.fn().mockImplementation((id, data) => {
    if (id === '1') {
      return Promise.resolve({ id: 1, ...data });
    } else {
      return Promise.reject(new Error('Loan not found'));
    }
  }),
  deleteLoanPayment: jest.fn().mockImplementation((id) => {
    if (id === '1') {
      return Promise.resolve(true);
    } else {
      return Promise.reject(new Error('Loan payment not found'));
    }
  }),
  getLoanStatistics: jest.fn().mockResolvedValue({
    totalLoans: 2,
    totalAmount: 3000,
    averageLoanAmount: 1500,
    loanTypeDistribution: [
      { loanTypeId: 1, loanTypeName: 'Personal', count: 1, totalAmount: 1000 },
      { loanTypeId: 2, loanTypeName: 'Car', count: 1, totalAmount: 2000 }
    ]
  })
}));

describe('Loan API Endpoints', () => {
  // Test GET all loans
  describe('GET /api/loans', () => {
    it('should return all loans', async () => {
      const res = await request(app)
        .get('/api/loans')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('amount', 1000);
    });
  });

  // Test GET loan by ID
  describe('GET /api/loans/:id', () => {
    it('should return a loan when valid ID is provided', async () => {
      const res = await request(app)
        .get('/api/loans/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('amount', 1000);
    });

    it('should return 404 for non-existent loan', async () => {
      await request(app)
        .get('/api/loans/999')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  // Test POST to create loan
  describe('POST /api/loans', () => {
    it('should create a new loan', async () => {
      const newLoan = {
        employeeId: 1,
        loanTypeId: 2,
        amount: 3000,
        dateApproved: '2023-03-01'
      };

      const res = await request(app)
        .post('/api/loans')
        .send(newLoan)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(res.body).toHaveProperty('id', 3);
      expect(res.body).toHaveProperty('amount', 3000);
    });
  });

  // Test PUT to update loan
  describe('PUT /api/loans/:id', () => {
    it('should update an existing loan', async () => {
      const updatedLoan = {
        employeeId: 1,
        loanTypeId: 1,
        amount: 1500,
        dateApproved: '2023-01-01'
      };

      const res = await request(app)
        .put('/api/loans/1')
        .send(updatedLoan)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('amount', 1500);
    });

    it('should return 404 for updating non-existent loan', async () => {
      await request(app)
        .put('/api/loans/999')
        .send({ amount: 2000 })
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  // Test DELETE loan payment
  describe('DELETE /api/loan-payments/:id', () => {
    it('should delete an existing loan payment', async () => {
      const res = await request(app)
        .delete('/api/loan-payments/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('message', 'Loan payment deleted successfully');
    });

    it('should return 404 for deleting non-existent loan payment', async () => {
      await request(app)
        .delete('/api/loan-payments/999')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  // Test loan statistics
  describe('GET /api/statistics/loans', () => {
    it('should return loan statistics', async () => {
      const res = await request(app)
        .get('/api/statistics/loans')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('totalLoans', 2);
      expect(res.body).toHaveProperty('totalAmount', 3000);
      expect(res.body).toHaveProperty('averageLoanAmount', 1500);
      expect(res.body).toHaveProperty('loanTypeDistribution');
      expect(Array.isArray(res.body.loanTypeDistribution)).toBeTruthy();
    });
  });
});
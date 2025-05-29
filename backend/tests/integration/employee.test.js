const request = require('supertest');
const app = require('../../app');

// Mock the EmployeeService to avoid actual database calls
jest.mock('../../services/EmployeeService', () => ({
  getAllEmployees: jest.fn().mockResolvedValue([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', departmentId: 1 },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', departmentId: 2 }
  ]),
  getEmployeeById: jest.fn().mockImplementation((id) => {
    if (id === '1') {
      return Promise.resolve({ id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', departmentId: 1 });
    } else {
      return Promise.reject(new Error('Employee not found'));
    }
  }),
  createEmployee: jest.fn().mockResolvedValue({ 
    id: 3, 
    firstName: 'Bob', 
    lastName: 'Johnson', 
    email: 'bob.johnson@example.com', 
    departmentId: 1 
  }),
  updateEmployee: jest.fn().mockImplementation((id, data) => {
    if (id === '1') {
      return Promise.resolve({ id: 1, ...data });
    } else {
      return Promise.reject(new Error('Employee not found'));
    }
  }),
  deactivateEmployee: jest.fn().mockImplementation((id) => {
    if (id === '1') {
      return Promise.resolve(true);
    } else {
      return Promise.reject(new Error('Employee not found'));
    }
  }),
  getEmployeeStatistics: jest.fn().mockResolvedValue({
    total: 2,
    activeCount: 2,
    departmentDistribution: [
      { departmentId: 1, departmentName: 'HR', count: 1 },
      { departmentId: 2, departmentName: 'IT', count: 1 }
    ]
  })
}));

describe('Employee API Endpoints', () => {
  // Test GET all employees
  describe('GET /api/employees', () => {
    it('should return all employees', async () => {
      const res = await request(app)
        .get('/api/employees')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('firstName', 'John');
    });
  });

  // Test GET employee by ID
  describe('GET /api/employees/:id', () => {
    it('should return an employee when valid ID is provided', async () => {
      const res = await request(app)
        .get('/api/employees/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('firstName', 'John');
    });

    it('should return 404 for non-existent employee', async () => {
      await request(app)
        .get('/api/employees/999')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  // Test POST to create employee
  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const newEmployee = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        departmentId: 1
      };

      const res = await request(app)
        .post('/api/employees')
        .send(newEmployee)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(res.body).toHaveProperty('id', 3);
      expect(res.body).toHaveProperty('firstName', 'Bob');
    });
  });

  // Test PUT to update employee
  describe('PUT /api/employees/:id', () => {
    it('should update an existing employee', async () => {
      const updatedEmployee = {
        firstName: 'John',
        lastName: 'Updated',
        email: 'john.updated@example.com',
        departmentId: 1
      };

      const res = await request(app)
        .put('/api/employees/1')
        .send(updatedEmployee)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('lastName', 'Updated');
    });

    it('should return 404 for updating non-existent employee', async () => {
      await request(app)
        .put('/api/employees/999')
        .send({ firstName: 'Test' })
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  // Test DELETE employee (deactivate)
  describe('DELETE /api/employees/:id', () => {
    it('should deactivate an existing employee', async () => {
      const res = await request(app)
        .delete('/api/employees/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('message', 'Employee deactivated successfully');
    });

    it('should return 404 for deactivating non-existent employee', async () => {
      await request(app)
        .delete('/api/employees/999')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  // Test employee statistics
  describe('GET /api/statistics/employees', () => {
    it('should return employee statistics', async () => {
      const res = await request(app)
        .get('/api/statistics/employees')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('total', 2);
      expect(res.body).toHaveProperty('activeCount', 2);
      expect(res.body).toHaveProperty('departmentDistribution');
      expect(Array.isArray(res.body.departmentDistribution)).toBeTruthy();
    });
  });
});
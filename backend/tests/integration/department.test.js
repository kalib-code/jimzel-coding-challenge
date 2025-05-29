const request = require('supertest');
const app = require('../../app');

// Mock the DepartmentService to avoid actual database calls
jest.mock('../../services/DepartmentService', () => ({
  getAllDepartments: jest.fn().mockResolvedValue([
    { id: 1, name: 'HR', description: 'Human Resources' },
    { id: 2, name: 'IT', description: 'Information Technology' }
  ]),
  getDepartmentById: jest.fn().mockImplementation((id) => {
    if (id === '1') {
      return Promise.resolve({ id: 1, name: 'HR', description: 'Human Resources' });
    } else {
      return Promise.reject(new Error('Department not found'));
    }
  }),
  createDepartment: jest.fn().mockResolvedValue({ 
    id: 3, 
    name: 'Finance', 
    description: 'Finance Department' 
  }),
  updateDepartment: jest.fn().mockImplementation((id, data) => {
    if (id === '1') {
      return Promise.resolve({ id: 1, ...data });
    } else {
      return Promise.reject(new Error('Department not found'));
    }
  }),
  deleteDepartment: jest.fn().mockImplementation((id) => {
    if (id === '1') {
      return Promise.resolve(true);
    } else {
      return Promise.reject(new Error('Department not found'));
    }
  })
}));

describe('Department API Endpoints', () => {
  // Test GET all departments
  describe('GET /api/departments', () => {
    it('should return all departments', async () => {
      const res = await request(app)
        .get('/api/departments')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'HR');
    });
  });

  // Test GET department by ID
  describe('GET /api/departments/:id', () => {
    it('should return a department when valid ID is provided', async () => {
      const res = await request(app)
        .get('/api/departments/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name', 'HR');
    });

    it('should return 404 for non-existent department', async () => {
      await request(app)
        .get('/api/departments/999')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  // Test POST to create department
  describe('POST /api/departments', () => {
    it('should create a new department', async () => {
      const newDepartment = {
        name: 'Finance',
        description: 'Finance Department'
      };

      const res = await request(app)
        .post('/api/departments')
        .send(newDepartment)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(res.body).toHaveProperty('id', 3);
      expect(res.body).toHaveProperty('name', 'Finance');
    });
  });

  // Test PUT to update department
  describe('PUT /api/departments/:id', () => {
    it('should update an existing department', async () => {
      const updatedDepartment = {
        name: 'HR Updated',
        description: 'Human Resources Department Updated'
      };

      const res = await request(app)
        .put('/api/departments/1')
        .send(updatedDepartment)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name', 'HR Updated');
    });

    it('should return 404 for updating non-existent department', async () => {
      await request(app)
        .put('/api/departments/999')
        .send({ name: 'Test' })
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  // Test DELETE department
  describe('DELETE /api/departments/:id', () => {
    it('should delete an existing department', async () => {
      const res = await request(app)
        .delete('/api/departments/1')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('message', 'Department deleted successfully');
    });

    it('should return 404 for deleting non-existent department', async () => {
      await request(app)
        .delete('/api/departments/999')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
});
import { rest } from 'msw';

// Sample data for tests
export const mockEmployees = [
  {
    id: 1,
    empl_id: 'EMP001',
    first_name: 'John',
    last_name: 'Doe',
    middle_name: 'M',
    suffix: 'Jr',
    department_id: 1,
    department_name: 'IT',
    position_id: 1,
    position_title: 'Developer',
    employment_type_id: 1,
    employment_type: 'Full-time',
    active: true,
  },
  {
    id: 2,
    empl_id: 'EMP002',
    first_name: 'Jane',
    last_name: 'Smith',
    middle_name: '',
    suffix: '',
    department_id: 2,
    department_name: 'HR',
    position_id: 2,
    position_title: 'Manager',
    employment_type_id: 1,
    employment_type: 'Full-time',
    active: true,
  },
];

export const mockDepartments = [
  {
    id: 1,
    name: 'IT',
    description: 'Information Technology Department',
  },
  {
    id: 2,
    name: 'HR',
    description: 'Human Resources Department',
  },
];

export const mockLoans = [
  {
    id: 1,
    employee_id: 1,
    employee_name: 'John Doe',
    loan_type_id: 1,
    loan_type: 'Personal',
    amount: 1000,
    date_approved: '2023-01-15',
    status: 'active',
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: 'Jane Smith',
    loan_type_id: 2,
    loan_type: 'Car',
    amount: 2000,
    date_approved: '2023-02-15',
    status: 'active',
  },
];

// Define handlers for API endpoints
export const handlers = [
  // Employees endpoints
  rest.get('/api/employees', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockEmployees)
    );
  }),
  
  rest.get('/api/employees/:id', (req, res, ctx) => {
    const { id } = req.params;
    const employee = mockEmployees.find(e => e.id === Number(id));
    
    if (employee) {
      return res(ctx.status(200), ctx.json(employee));
    } else {
      return res(ctx.status(404), ctx.json({ error: 'Employee not found' }));
    }
  }),
  
  rest.post('/api/employees', (req, res, ctx) => {
    // Create a new employee with mock ID
    const newEmployee = {
      id: mockEmployees.length + 1,
      ...req.body,
    };
    
    return res(ctx.status(201), ctx.json(newEmployee));
  }),
  
  // Departments endpoints
  rest.get('/api/departments', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockDepartments)
    );
  }),
  
  rest.get('/api/departments/:id', (req, res, ctx) => {
    const { id } = req.params;
    const department = mockDepartments.find(d => d.id === Number(id));
    
    if (department) {
      return res(ctx.status(200), ctx.json(department));
    } else {
      return res(ctx.status(404), ctx.json({ error: 'Department not found' }));
    }
  }),
  
  // Loans endpoints
  rest.get('/api/loans', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockLoans)
    );
  }),
  
  rest.get('/api/loans/:id', (req, res, ctx) => {
    const { id } = req.params;
    const loan = mockLoans.find(l => l.id === Number(id));
    
    if (loan) {
      return res(ctx.status(200), ctx.json(loan));
    } else {
      return res(ctx.status(404), ctx.json({ error: 'Loan not found' }));
    }
  }),
  
  // Reference data endpoints
  rest.get('/api/positions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Developer' },
        { id: 2, name: 'Manager' },
      ])
    );
  }),
  
  rest.get('/api/employment-types', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Full-time' },
        { id: 2, name: 'Part-time' },
      ])
    );
  }),
];
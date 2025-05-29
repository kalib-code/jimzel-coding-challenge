const express = require('express');
const router = express.Router();

// Import controllers
const EmployeeController = require('../controllers/EmployeeController');
const DepartmentController = require('../controllers/DepartmentController');
const LoanController = require('../controllers/LoanController');
const ReferenceController = require('../controllers/ReferenceController');

// Root API endpoint
router.get('/', (req, res) => {
  console.log('Root API endpoint called');
  console.log('Client IP:', req.ip);

  res.json({
    message: 'Employee Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint with all HTTP methods
router.all('/test', (req, res) => {
  console.log('Test endpoint called with method:', req.method);
  console.log('Client IP:', req.ip);
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('Query:', JSON.stringify(req.query));
  console.log('Body:', JSON.stringify(req.body));

  res.json({
    message: 'Test endpoint',
    method: req.method,
    timestamp: new Date().toISOString(),
    headers: req.headers,
    query: req.query,
    body: req.body
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  console.log('Health check endpoint called');
  console.log('Client IP:', req.ip);
  console.log('Headers:', JSON.stringify(req.headers));

  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    clientIp: req.ip,
    headers: req.headers
  });
});

/* ----- DEPARTMENTS API ----- */
router.get('/departments', DepartmentController.getAllDepartments);
router.get('/departments/:id', DepartmentController.getDepartmentById);
router.post('/departments', DepartmentController.createDepartment);
router.put('/departments/:id', DepartmentController.updateDepartment);
router.delete('/departments/:id', DepartmentController.deleteDepartment);

/* ----- EMPLOYEES API ----- */
router.get('/employees', EmployeeController.getAllEmployees);
router.get('/employees/:id', EmployeeController.getEmployeeById);
router.post('/employees', EmployeeController.createEmployee);
router.put('/employees/:id', EmployeeController.updateEmployee);
router.delete('/employees/:id', EmployeeController.deactivateEmployee);

/* ----- LOANS API ----- */
router.get('/loans', LoanController.getAllLoans);
router.get('/loans/:id', LoanController.getLoanById);
router.post('/loans', LoanController.createLoan);
router.put('/loans/:id', LoanController.updateLoan);
router.delete('/loan-payments/:id', LoanController.deleteLoanPayment);

/* ----- REFERENCE DATA APIs ----- */
router.get('/positions', ReferenceController.getPositions);
router.get('/employment-types', ReferenceController.getEmploymentTypes);
router.get('/vendors', ReferenceController.getVendors);
router.get('/banks', ReferenceController.getBanks);
router.get('/pay-frequencies', ReferenceController.getPayFrequencies);
router.get('/rate-types', ReferenceController.getRateTypes);
router.get('/loan-types', ReferenceController.getLoanTypes);

/* ----- STATISTICS APIs ----- */
router.get('/statistics/employees', EmployeeController.getEmployeeStatistics);
router.get('/statistics/loans', LoanController.getLoanStatistics);

module.exports = router;

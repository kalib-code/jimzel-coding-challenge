# Employee Management System API

This API provides endpoints for managing employees, departments, loans, and other related data. The backend follows the MVC (Model-View-Controller) architecture pattern for better separation of concerns and maintainability.

## Architecture

### MVC Structure
- **Models**: Handle data access and business logic
- **Views**: The API returns JSON, so traditional views are not used
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and interact with models
- **Middlewares**: Handle cross-cutting concerns like error handling

### Directory Structure
```
backend/
├── config/         # Configuration files
├── controllers/    # HTTP request handlers
├── middlewares/    # Custom middleware
├── models/         # Data access layer
├── routes/         # API route definitions
├── services/       # Business logic layer
├── tests/          # API tests
│   ├── integration/   # Integration tests
│   ├── mocks/         # Mock data
│   └── utils/         # Test utilities
├── views/          # View templates (for web UI)
└── app.js          # Main application file
```

## API Endpoints

### Base URL
- `GET /api` - API information
- `GET /api/health` - Health check

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Employees
- `GET /api/employees` - Get all employees
  - Query params: `department`, `active`, `search`
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee (soft delete)

### Loans
- `GET /api/loans` - Get all loans
  - Query params: `employee_id`
- `GET /api/loans/:id` - Get loan by ID (includes payments)
- `POST /api/loans` - Create loan
- `PUT /api/loans/:id` - Update loan
- `DELETE /api/loan-payments/:id` - Delete loan payment

### Reference Data
- `GET /api/positions` - Get all positions
- `GET /api/employment-types` - Get all employment types
- `GET /api/vendors` - Get all vendors
- `GET /api/banks` - Get all banks
- `GET /api/pay-frequencies` - Get all pay frequencies
- `GET /api/rate-types` - Get all rate types
- `GET /api/loan-types` - Get all loan types

### Statistics
- `GET /api/statistics/employees` - Get employee statistics
- `GET /api/statistics/loans` - Get loan statistics

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL database

### Install Dependencies
```bash
npm install
```

### Database Setup
1. Configure your database connection in `config/database.js`
2. Initialize the database with the schema:
```bash
mysql -u username -p database_name < init.sql
```

### Environment Variables
You can customize the application using environment variables:
- `PORT` - Server port (default: 3000)
- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASS` - Database password
- `DB_NAME` - Database name
- `NODE_ENV` - Environment (development, production, test)

## Running the Application

### Development Mode
For development with auto-reload:
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Testing
The project includes a comprehensive test suite using Jest and Supertest. The tests cover API endpoints and database interactions with mocks.

To run the tests:
```bash
# Install test dependencies
npm install jest supertest --save-dev

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Build Process

### Local Build
```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Docker Build
The project includes Docker configuration for easy deployment.

```bash
# Build the Docker image
docker build -t employee-management-api .

# Run the Docker container
docker run -p 3000:3000 employee-management-api
```

## Docker Compose

Run the entire stack (API and database) with Docker Compose:

```bash
docker-compose up
```

The API will be available at http://localhost:3000/api.

## Testing

The API includes a comprehensive testing suite with Jest and Supertest, focusing on API integration tests.

### Test Structure
- Integration Tests: Test the API endpoints and their interaction with services
- Mock Data: Provides test data for consistent testing
- Test Utilities: Helper functions for testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run a specific test file
npm test -- tests/integration/api.test.js
```

## Data Models

### Employee
```json
{
  "id": 1,
  "empl_id": "EMP001",
  "first_name": "Juan",
  "middle_name": "Dela",
  "last_name": "Cruz",
  "suffix": "Jr.",
  "address": "123 Main St.",
  "city": "Makati",
  "province": "Metro Manila",
  "zip": "1200",
  "location": "HQ",
  "email": "juan@example.com",
  "phone_no": "+639123456789",
  "birthday": "1990-01-15",
  "sex": "Male",
  "active": true,
  "kasam_bahay": false,
  "ctc_valid_id": "12345",
  "place_issued": "Makati",
  "ctc_date": "2022-01-10",
  "amount_paid": 100.00,
  "notes": "Sample notes",
  "user_profile": "employee",
  "manager_id": null,
  "department_id": 1,
  "department_name": "Human Resources",
  "position_id": 2,
  "position_title": "HR Specialist",
  "employment_type_id": 1,
  "employment_type": "Regular",
  "vendor_id": null,
  "date_hired": "2022-01-10",
  "regularized_date": null,
  "separated_date": null,
  "contract_start": null,
  "contract_end": null,
  "minimum_earner": false,
  "tax_id": "123-456-789-000",
  "tax_withheld": true,
  "sss_gsis_no": "01-2345678-9",
  "sss_gsis_withheld": true,
  "phic_id": "12-345678901-2",
  "phic_withheld": true,
  "hdmf_id": "1234-5678-9012",
  "hdmf_withheld": true,
  "hdmf_account": null,
  "bank_id": 1,
  "bank_name": "BDO",
  "bank_account": "1234567890",
  "pay_frequency_id": 2,
  "pay_frequency_name": "Semi-monthly",
  "rate_type_id": 1,
  "rate_type_name": "Monthly",
  "base_monthly_pay": 25000.00,
  "days_per_month": 22,
  "hours_per_day": 8,
  "daily_rate": 1136.36,
  "hourly_rate": 142.05,
  "cola": 0.00,
  "representation_allowance": 0.00,
  "housing_allowance": 0.00,
  "transportation_allowance": 0.00
}
```

### Loan
```json
{
  "id": 1,
  "loan_account_id": "LOAN001",
  "employee_id": 1,
  "first_name": "Juan",
  "last_name": "Cruz",
  "empl_id": "EMP001",
  "loan_type_id": 1,
  "loan_type_name": "SSS Loan",
  "issue_date": "2023-01-15",
  "start_date": "2023-02-01",
  "principal": 50000.00,
  "interest": 5000.00,
  "loan_amount": 55000.00,
  "months_to_pay": 12,
  "monthly_payment": 4583.33,
  "running_balance": 55000.00,
  "deduction_start_date": "2023-02-15",
  "deduct_per_pay": 2291.67,
  "pay_frequency_id": 2,
  "pay_frequency_name": "Semi-monthly",
  "loan_reference": "SSS-123456789",
  "particulars": null,
  "active": true,
  "payments": [
    {
      "id": 1,
      "loan_id": 1,
      "payment_date": "2023-02-15",
      "amount_paid": 2291.67,
      "remarks": "First payment"
    },
    {
      "id": 2,
      "loan_id": 1,
      "payment_date": "2023-02-28",
      "amount_paid": 2291.67,
      "remarks": "Second payment"
    }
  ]
}
```

## Technologies Used

### Core Framework
- Node.js - JavaScript runtime
- Express.js - Web framework

### Database
- MySQL - Relational database
- Connection pooling for efficient database access

### Monitoring and Logging
- Morgan - HTTP request logger
- Winston - General-purpose logger
- Rotating File Stream - Log rotation
- Express Status Monitor - Real-time server metrics

### Development Tools
- Nodemon - Auto-restart server during development
- ESLint - Code linting

### Testing
- Jest - Testing framework
- Supertest - HTTP testing

## Advanced Features

### Node.js Cluster
The application supports Node.js clustering to utilize multiple CPU cores and improve performance:

```js
var cluster = require('cluster');
var workers = process.env.WORKERS || require('os').cpus().length;

if (cluster.isMaster) {
  console.log('Master cluster is running on %s with %s workers', process.pid, workers);
  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork().process;
    console.log('worker %s on %s started', i+1, worker.pid);
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker %s died. restarting...', worker.process.pid);
    cluster.fork();
  });
}

if (cluster.isWorker) {
  // Server code
}
```

### Server Status Monitor
The application includes Express Status Monitor for real-time server metrics:

```js
app.use(require('express-status-monitor')({
  title: 'Server Status',
  path: '/status',
  spans: [{
    interval: 1,
    retention: 60
  }, {
    interval: 5,
    retention: 60
  }],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    eventLoop: true,
    heap: true,
    responseTime: true,
    rps: true,
    statusCodes: true
  },
  healthChecks: [{
    protocol: 'http',
    host: 'localhost',
    path: '/',
    port: '3000'
  }]
}));
```

## Contribution
To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License
This project is licensed under the MIT License.
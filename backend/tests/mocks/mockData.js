/**
 * This file contains mock data for testing purposes
 */

// Department mock data
const departments = [
  { id: 1, name: 'HR', description: 'Human Resources Department' },
  { id: 2, name: 'IT', description: 'Information Technology Department' },
  { id: 3, name: 'Finance', description: 'Finance Department' }
];

// Employee mock data
const employees = [
  { 
    id: 1, 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john.doe@example.com', 
    phoneNumber: '123-456-7890',
    address: '123 Main St',
    departmentId: 1,
    positionId: 1,
    employmentTypeId: 1,
    status: 'active',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  { 
    id: 2, 
    firstName: 'Jane', 
    lastName: 'Smith', 
    email: 'jane.smith@example.com', 
    phoneNumber: '098-765-4321',
    address: '456 Oak St',
    departmentId: 2,
    positionId: 2,
    employmentTypeId: 1,
    status: 'active',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z'
  }
];

// Loan mock data
const loans = [
  {
    id: 1,
    employeeId: 1,
    loanTypeId: 1,
    amount: 1000,
    dateApproved: '2023-01-15T00:00:00.000Z',
    status: 'active',
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-01-15T00:00:00.000Z'
  },
  {
    id: 2,
    employeeId: 2,
    loanTypeId: 2,
    amount: 2000,
    dateApproved: '2023-02-15T00:00:00.000Z',
    status: 'active',
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2023-02-15T00:00:00.000Z'
  }
];

// Reference data
const referenceData = {
  positions: [
    { id: 1, name: 'Manager' },
    { id: 2, name: 'Developer' },
    { id: 3, name: 'HR Specialist' }
  ],
  employmentTypes: [
    { id: 1, name: 'Full-time' },
    { id: 2, name: 'Part-time' },
    { id: 3, name: 'Contract' }
  ],
  vendors: [
    { id: 1, name: 'Vendor A' },
    { id: 2, name: 'Vendor B' }
  ],
  banks: [
    { id: 1, name: 'Bank A' },
    { id: 2, name: 'Bank B' }
  ],
  payFrequencies: [
    { id: 1, name: 'Weekly' },
    { id: 2, name: 'Bi-weekly' },
    { id: 3, name: 'Monthly' }
  ],
  rateTypes: [
    { id: 1, name: 'Hourly' },
    { id: 2, name: 'Salary' }
  ],
  loanTypes: [
    { id: 1, name: 'Personal' },
    { id: 2, name: 'Car' },
    { id: 3, name: 'Housing' }
  ]
};

// Statistics mock data
const statistics = {
  employees: {
    total: 2,
    activeCount: 2,
    departmentDistribution: [
      { departmentId: 1, departmentName: 'HR', count: 1 },
      { departmentId: 2, departmentName: 'IT', count: 1 }
    ]
  },
  loans: {
    totalLoans: 2,
    totalAmount: 3000,
    averageLoanAmount: 1500,
    loanTypeDistribution: [
      { loanTypeId: 1, loanTypeName: 'Personal', count: 1, totalAmount: 1000 },
      { loanTypeId: 2, loanTypeName: 'Car', count: 1, totalAmount: 2000 }
    ]
  }
};

module.exports = {
  departments,
  employees,
  loans,
  referenceData,
  statistics
};
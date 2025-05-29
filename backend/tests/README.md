# API Tests

This directory contains tests for the backend API endpoints.

## Structure

- `integration/` - Integration tests for API endpoints
  - `api.test.js` - Tests for core API endpoints
  - `department.test.js` - Tests for department endpoints
  - `employee.test.js` - Tests for employee endpoints
  - `loan.test.js` - Tests for loan endpoints
  - `reference.test.js` - Tests for reference data endpoints
- `mocks/` - Mock data for testing
  - `mockData.js` - Contains mock data for all entities
- `utils/` - Utility functions for testing
  - `testUtils.js` - Contains helper functions for testing
- `setup.js` - Test setup file with mocks for database and loggers

## Running Tests

To run the tests, use the following commands:

```bash
# Install dependencies (if not already installed)
npm install jest supertest --save-dev

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npm test -- tests/integration/api.test.js
```

## Test Approach

The tests use Jest as the test runner and Supertest for making HTTP requests to the API. We follow these testing principles:

1. **Isolation**: All tests run in isolation without requiring external services or a database connection
2. **Mocking**: Service dependencies are mocked to return predictable responses
3. **Coverage**: Tests aim to cover all API endpoints and error scenarios
4. **Readability**: Tests are structured to make it clear what is being tested and what the expected behavior is

### Mocking Strategy

We use Jest's mocking capabilities to replace service implementations with controlled test doubles:

- **Service Mocks**: Replace the actual service implementations to avoid database calls
- **Database Mocks**: Mock the database connection in the setup file
- **Mock Data**: Use consistent mock data from the `mocks/mockData.js` file

## Adding New Tests

To add a new test:

1. Create a new test file in the appropriate directory
2. Import the necessary dependencies and mock data
3. Mock any services or dependencies
4. Write your tests with descriptive test cases

Example:

```javascript
const request = require('supertest');
const app = require('../../app');
const { mockData } = require('../mocks/mockData');

// Mock services
jest.mock('../../services/YourService', () => ({
  getAllItems: jest.fn().mockResolvedValue(mockData.yourItems),
  getItemById: jest.fn().mockImplementation((id) => {
    const item = mockData.yourItems.find(item => item.id === parseInt(id));
    if (!item) {
      return Promise.reject(new Error('Item not found'));
    }
    return Promise.resolve(item);
  }),
  // Add other methods as needed
}));

describe('Your API Endpoint', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/your-items', () => {
    it('should return all items', async () => {
      const res = await request(app)
        .get('/api/your-items')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(mockData.yourItems.length);
    });
  });

  describe('GET /api/your-items/:id', () => {
    it('should return an item when valid ID is provided', async () => {
      const res = await request(app)
        .get('/api/your-items/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('id', 1);
    });

    it('should return 404 for non-existent item', async () => {
      await request(app)
        .get('/api/your-items/999')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
});
```

## Best Practices

1. Use descriptive test names that clearly state what's being tested
2. Group related tests using nested `describe` blocks
3. Test both success and error scenarios
4. Reset mocks before each test to ensure a clean state
5. Use the provided mock data and utility functions for consistency
6. Test HTTP status codes and response formats
7. Avoid testing implementation details, focus on API behavior
# Frontend Tests

This directory contains tests for the frontend application components, pages, and services.

## Structure

- `components/` - Tests for UI components
  - `CreateModal.test.tsx` - Tests for the CreateModal component
  - `Layout.test.tsx` - Tests for the Layout component
- `pages/` - Tests for page components
  - `EmployeeList.test.tsx` - Tests for the EmployeeList page component
- `providers/` - Tests for data providers and services
  - `dataProvider.test.ts` - Tests for the Refine data provider
  - `httpClient.test.ts` - Tests for the HTTP client and interceptors
- `mocks/` - Mock data and handlers for testing
  - `server.ts` - MSW server setup
  - `handlers.ts` - API request handlers for mocking
- `utils/` - Test utilities
  - `test-utils.tsx` - Custom render function with providers
- `setup.ts` - Global test setup

## Running Tests

To run the tests, use the following commands:

```bash
# Install dependencies (if not already installed)
npm install vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw --save-dev

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npm test -- tests/components/CreateModal.test.tsx
```

## Testing Approach

The tests use Vitest as the test runner and React Testing Library for testing React components. We follow these testing principles:

1. **Component Testing**: Test UI components in isolation to ensure they render correctly and respond to user interactions
2. **Integration Testing**: Test how components work together and with data providers
3. **API Mocking**: Use MSW (Mock Service Worker) to mock API calls and test handling of different responses
4. **Coverage**: Tests aim to cover essential functionality and error scenarios

### Component Testing Strategy

We test components with these focuses:

- **Rendering**: Does the component render correctly with different props?
- **User Interactions**: Does the component respond correctly to user actions?
- **Conditional Rendering**: Does the component render differently based on props or state?
- **State Updates**: Does the component update correctly when state changes?

### API Testing Strategy

For testing API integration:

- **Mock Responses**: Using MSW to mock API responses
- **Success Cases**: Test handling of successful responses
- **Error Cases**: Test handling of error responses
- **Loading States**: Test UI during loading states

## Best Practices

1. Use descriptive test names that clearly state what's being tested
2. Group related tests using nested `describe` blocks
3. Test both success and error scenarios
4. Reset mocks and clean up after each test
5. Use the provided utilities for consistent testing
6. Test from the user's perspective - focus on what they see and do
7. Avoid testing implementation details

## Adding New Tests

To add a new test:

1. Create a new test file in the appropriate directory
2. Import the necessary utilities and components
3. Write your tests using the `describe` and `it` structure
4. Use the custom `render` function from `test-utils.tsx` for consistent testing
5. Run the tests to ensure they pass

Example:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { YourComponent } from '../../src/components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('responds to user interaction', () => {
    const handleClick = vi.fn();
    render(<YourComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```
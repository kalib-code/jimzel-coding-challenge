# Employee Management System - Frontend

A modern React-based frontend application for managing employees, departments, and loans.

<div align="center" style="margin: 30px;">
    <img alt="app screenshot" src="https://via.placeholder.com/800x400?text=Employee+Management+System" style="max-width: 800px; border-radius: 10px;">
</div>

## Overview

This frontend application is built with React, TypeScript, and the [Refine](https://github.com/refinedev/refine) framework, providing a robust user interface for managing employee data, departments, and loans. It features a responsive design using PrimeReact components.

## Tech Stack

- **Framework**: React with TypeScript
- **Admin Framework**: Refine
- **UI Library**: PrimeReact
- **State Management**: React Query (via Refine)
- **Routing**: React Router
- **API Integration**: Axios
- **Testing**: Vitest and React Testing Library
- **Build Tool**: Vite

## Directory Structure

```
client/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── interfaces/       # TypeScript interfaces
│   ├── pages/            # Page components
│   │   ├── departments/  # Department management
│   │   ├── employees/    # Employee management
│   │   └── loans/        # Loan management
│   ├── providers/        # API providers
│   └── App.tsx           # Main application component
└── tests/                # Test files
    ├── components/       # Component tests
    ├── mocks/            # Mock data and API handlers
    ├── pages/            # Page component tests
    ├── providers/        # API provider tests
    └── utils/            # Test utilities
```

## Features

- **Dashboard**: Overview of key metrics and statistics
- **Employee Management**: Create, read, update, and deactivate employees
- **Department Management**: Manage organizational structure
- **Loan Management**: Track employee loans and payments
- **Reference Data**: Manage positions, employment types, etc.
- **Responsive Design**: Works on desktop and mobile devices
- **API Integration**: Connects to backend API

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3000/api
```

## Running the Application

### Development Server

```bash
pnpm dev
```

This starts the development server at [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
# Build the application
pnpm build

# Preview the built application
pnpm preview
```

### Docker Build

```bash
# Build the Docker image
docker build -t employee-management-client .

# Run the Docker container
docker run -p 5173:80 employee-management-client
```

## Testing

The project includes a comprehensive test suite using Vitest and React Testing Library.

### Running Tests

```bash
# Install test dependencies (if not already installed)
pnpm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw

# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Test Structure

- **Component Tests**: Test individual UI components
- **Page Tests**: Test page components and their functionality
- **API Integration Tests**: Test API providers and data handling
- **Mock Service Worker**: Mock API responses for consistent testing

## Deployment

### Build for Production

```bash
# Build the application
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options

1. **Static Hosting**:
   - Upload the contents of the `dist/` directory to any static hosting service
   - Configure the server to handle client-side routing

2. **Docker Deployment**:
   - Use the included Dockerfile to build a container
   - Deploy the container to your preferred hosting service

3. **Continuous Integration**:
   - Set up CI/CD pipeline to automate testing and deployment

## Docker Integration

The application can be run using Docker:

```bash
# Build the Docker image
docker build -t employee-management-client .

# Run the Docker container
docker run -p 5173:80 employee-management-client
```

### Docker Compose

The application can be run alongside the backend using Docker Compose:

```bash
# From the project root directory
docker-compose up
```

## Project Structure Details

### Key Components

- **Layout**: Main application layout with sidebar and content area
- **CRUD Modals**: Reusable components for create, read, update, delete operations
- **Forms**: Form components for data entry
- **Tables**: Data display components
- **Filters**: Filter components for data filtering

### Pages

- **List Pages**: Display data in tables with filtering and sorting
- **Show Pages**: Display detailed information about a single record
- **Create Pages**: Forms for creating new records
- **Edit Pages**: Forms for updating existing records

### State Management

The application uses React Query (via Refine) for state management, providing:

- Data fetching and caching
- Optimistic updates
- Mutation handling
- Error handling

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

## Learn More

- [Refine Documentation](https://refine.dev/docs)
- [PrimeReact Documentation](https://primereact.org/documentation/)
- [React Router Documentation](https://reactrouter.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react)

## License

MIT
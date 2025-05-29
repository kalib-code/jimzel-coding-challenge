# Jimzel Challenge Project

This project consists of a Node.js/Express backend with MySQL database and a React frontend client.

## Docker Setup

The entire application stack can be run using Docker Compose, which will set up:
- Backend (Node.js/Express)
- Frontend (React)
- MySQL Database

### Prerequisites

- Docker and Docker Compose installed on your machine

### Running the Application

1. Clone this repository
2. Navigate to the project root directory
3. Start all services:

```bash
docker-compose up
```

This will:
- Build and start the backend on port 3000
- Build and start the client on port 5173
- Start MySQL on port 3306
- Initialize the database with sample data

### Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MySQL Database: localhost:3306
  - Username: arjun
  - Password: password
  - Database: mysqldb

### Stopping the Application

```bash
docker-compose down
```

To remove volumes when stopping:

```bash
docker-compose down -v
```

## Development

For local development without Docker:

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Database

The MySQL database is initialized with some sample tables and data. See `backend/init.sql` for details.
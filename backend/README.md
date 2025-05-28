# YourManager AI Backend

Backend for YourManager AI Chief-of-Staff SaaS application using PostgreSQL.

## Database Setup

This project uses PostgreSQL. Follow these steps to set up your database:

1. Install PostgreSQL on your machine if you haven't already
2. Create a database named `managerai`:
   ```sql
   CREATE DATABASE managerai;
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   
   # Database Config
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=managerai
   INIT_DB=true
   
   # JWT Config
   JWT_SECRET=your_jwt_secret_change_in_production
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```
   
4. Change `DB_USER` and `DB_PASSWORD` to match your PostgreSQL credentials
5. Set `INIT_DB=true` to automatically create tables on first run

## TypeScript Implementation

This project is built using TypeScript and uses PostgreSQL as the database.

### Scripts

- `npm start` - Start the server from compiled JavaScript in the dist folder
- `npm run build` - Build TypeScript files to JavaScript
- `npm run dev` - Run the server in development mode using ts-node-dev

## Running the Server

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start in production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `GET /api/auth/logout` - Logout user (Protected)

## API Documentation

API documentation will be added soon. 
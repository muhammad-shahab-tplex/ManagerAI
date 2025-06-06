# ManagerAI - Your AI Chief-of-Staff

A complete AI-powered Chief-of-Staff SaaS application with TypeScript, React, and PostgreSQL.

## Project Structure

The project is organized into two main directories:

- `frontend/` - React-based user interface
- `backend/` - TypeScript Node.js server with Prisma ORM

### Backend Structure

The backend is built with TypeScript and uses Prisma ORM to interact with PostgreSQL:

- `backend/prisma/` - Main Prisma schema and migrations
- `backend/src/` - TypeScript source code
  - `src/prisma/` - Prisma client TypeScript wrapper
  - `src/database/` - Legacy directory with documentation on database patterns

### About Prisma ORM

This project uses Prisma ORM for database access. The primary Prisma files are located in:

- `backend/prisma/schema.prisma` - Main schema definition
- `backend/prisma/migrations/` - Database migrations
- `backend/src/prisma/` - TypeScript client code

The JavaScript files you might see in the compiled output (`dist/` directory) or in the generated Prisma client are automatically generated from TypeScript source code.

## Development Setup

1. Clone the repository
2. Install dependencies for backend and frontend:
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```
3. Set up your database (see backend/README.md for details)
4. Start the development servers:
   ```bash
   # In backend directory
   npm run dev
   
   # In frontend directory
   npm start
   ```

## Documentation

For more detailed information, see the README files in each subdirectory:

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md) 
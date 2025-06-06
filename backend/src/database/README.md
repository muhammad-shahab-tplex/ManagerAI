# Database Management

This directory is maintained for documentation purposes only. The project now uses Prisma ORM for all database operations.

## Prisma Setup

All database operations are handled through Prisma ORM:

1. Main schema is defined in `/prisma/schema.prisma`
2. Migrations are stored in `/prisma/migrations/`
3. Client code is in `/src/prisma/`

## How to Access the Database

Use the Prisma client to access the database:

```typescript
import { prisma } from '../prisma';

// Example query
const users = await prisma.user.findMany();
```

## Common Operations

- **Create a record**:
  ```typescript
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe'
    }
  });
  ```

- **Query records**:
  ```typescript
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: '@example.com'
      }
    }
  });
  ```

- **Update a record**:
  ```typescript
  const user = await prisma.user.update({
    where: { id: 1 },
    data: { name: 'Jane Doe' }
  });
  ```

- **Delete a record**:
  ```typescript
  const user = await prisma.user.delete({
    where: { id: 1 }
  });
  ```

For more information on using Prisma, refer to `/prisma/README.md` or the [official Prisma documentation](https://www.prisma.io/docs/). 
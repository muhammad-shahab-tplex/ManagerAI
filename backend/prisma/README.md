# Prisma ORM Configuration

This directory contains the primary Prisma ORM configuration for the project.

## Important Files

- `schema.prisma` - The main database schema definition
- `migrations/` - All database migrations created and managed by Prisma

## Folder Structure

The project uses the following Prisma-related locations:

- `/prisma` (this directory) - Contains the schema and migrations
- `/src/prisma` - Contains the TypeScript client wrapper code including:
  - `client.ts` - TypeScript wrapper for the Prisma client
  - `index.ts` - Exports the client
  - `migrate.ts` - Migration utility

## Working with Prisma

### Generate Client

After making changes to the schema, generate the client:

```bash
npx prisma generate
```

### Create Migrations

```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations

```bash
npx prisma migrate deploy
```

### Reset Database

```bash
npx prisma migrate reset
```

### View Data with Prisma Studio

```bash
npx prisma studio
```

## Important Notes

- Always run `npx prisma generate` after pulling changes that include schema updates
- The JavaScript files in the `generated/prisma` directory are auto-generated and should not be edited manually
- The Prisma client is accessible through the wrapper at `src/prisma`

## Available Scripts

- `npm run prisma:generate` - Generate Prisma Client types
- `npm run prisma:studio` - Open Prisma Studio to browse the database
- `npm run prisma:push` - Push schema changes directly to the database (dev only)
- `npm run prisma:dev` - Create a new migration
- `npm run prisma:deploy` - Apply pending migrations
- `npm run migrate` - Run migrations programmatically
- `npm run migrate:reset` - Reset the database and apply all migrations
- `npm run db:seed` - Seed the database with initial data

## Best Practices

1. **Use the Prisma Client in services**

   Create service files for different entities in your application. For example:
   ```typescript
   // src/services/userService.ts
   import { prisma } from '../prisma';

   export class UserService {
     async findById(id: number) {
       return prisma.user.findUnique({ where: { id } });
     }
   }
   ```

2. **Keep your schema organized**

   - Add meaningful comments to your models
   - Use consistent naming conventions
   - Group related models together

3. **Use transactions for complex operations**

   ```typescript
   await prisma.$transaction(async (tx) => {
     // Multiple database operations
     const user = await tx.user.create({...});
     await tx.userPreference.create({...});
   });
   ```

4. **Always handle database connections properly**

   Use the singleton pattern as implemented in `src/prisma/client.ts` to avoid connection issues.

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference) 
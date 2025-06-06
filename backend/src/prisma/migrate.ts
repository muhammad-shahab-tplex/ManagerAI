import { execSync } from 'child_process';
import path from 'path';

/**
 * Applies all pending Prisma migrations to the database.
 * 
 * @param {boolean} reset - If true, resets the database before running migrations
 */
export function runMigrations(reset = false): void {
  try {
    console.log('Running Prisma migrations...');
    const command = reset ? 'prisma migrate reset --force' : 'prisma migrate deploy';
    
    execSync(`npx ${command}`, {
      stdio: 'inherit',
      cwd: path.resolve(process.cwd()),
    });
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

/**
 * Generates Prisma Client types based on the schema.
 */
export function generatePrismaClient(): void {
  try {
    console.log('Generating Prisma Client...');
    
    execSync('npx prisma generate', {
      stdio: 'inherit',
      cwd: path.resolve(process.cwd()),
    });
    
    console.log('Prisma Client generated successfully');
  } catch (error) {
    console.error('Error generating Prisma Client:', error);
    process.exit(1);
  }
} 
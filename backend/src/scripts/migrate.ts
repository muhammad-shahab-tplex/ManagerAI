#!/usr/bin/env node
/**
 * Script to run Prisma migrations programmatically
 * 
 * Usage: 
 *   npx ts-node src/scripts/migrate.ts [--reset]
 */

import { runMigrations, generatePrismaClient } from '../prisma/migrate';

async function main() {
  try {
    const reset = process.argv.includes('--reset');
    console.log(`Running migrations with reset=${reset}...`);
    
    await runMigrations(reset);
    await generatePrismaClient();
    
    console.log('Migration process completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 
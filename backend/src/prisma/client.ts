import { PrismaClient } from '../generated/prisma';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a placeholder prisma client in case the real one fails to connect
const dummyPrisma = {
  // This is a simplified placeholder that won't throw errors
  // In a real application, you'd want to implement proper error handling
  $connect: () => Promise.resolve(),
  $disconnect: () => Promise.resolve(),
  user: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: (data: any) => Promise.resolve(data.data),
    update: (data: any) => Promise.resolve(data.data),
    delete: () => Promise.resolve(null),
  },
  // Add other models as needed
};

// Create a singleton Prisma client that can be used throughout the app
let prismaClient: any;

try {
  prismaClient = global.prisma || 
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

  // In development, we want to use the same instance across hot-reloads
  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prismaClient;
  }
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  prismaClient = dummyPrisma;
}

export const prisma = prismaClient; 
import { Request, Response, NextFunction } from 'express';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        subscriptionTier?: string;
      };
    }
  }
}

// Fix Router method types
declare module 'express-serve-static-core' {
  interface Router {
    get(path: string | RegExp, ...handlers: any[]): this;
    post(path: string | RegExp, ...handlers: any[]): this;
    put(path: string | RegExp, ...handlers: any[]): this;
    delete(path: string | RegExp, ...handlers: any[]): this;
    patch(path: string | RegExp, ...handlers: any[]): this;
  }
}

export {}; 
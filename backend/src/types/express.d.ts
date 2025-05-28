import express from 'express';
import { Request as ExpressRequest, Response, NextFunction } from 'express';

// Fix for Express route handler type issues
declare module 'express' {
  interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
  }
  
  interface Router {
    get(path: string, ...handlers: Array<RequestHandler>): Router;
    post(path: string, ...handlers: Array<RequestHandler>): Router;
    put(path: string, ...handlers: Array<RequestHandler>): Router;
    delete(path: string, ...handlers: Array<RequestHandler>): Router;
    patch(path: string, ...handlers: Array<RequestHandler>): Router;
  }
}

// User extension
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

// Allow any return type from Express handlers
declare module 'express-serve-static-core' {
  interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
  }
}

// This file is treated as a module if we export something
export {}; 
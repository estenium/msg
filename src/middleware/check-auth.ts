import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../helpers/error';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') return next();

  const handleUnauthenticated = () => {
    return next(new HttpError('Authentication failed', 401));
  };

  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  let token: string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (authHeader) {
    token = authHeader.trim(); // Raw token fallback (non-standard)
  }

  // Optional fallback: support token in body (for non-GET methods)
  if (!token && req.method === 'POST') {
    token = req.body?.token;
  }

  // Validate token
  if (!token || token !== process.env.API_ACCESS_TOKEN) {
    return handleUnauthenticated();
  }

  // token is valid
  next();
};

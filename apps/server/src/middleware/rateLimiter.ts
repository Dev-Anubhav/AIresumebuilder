import { Request, Response, NextFunction } from 'express';

const ipCache = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (limit = 100, windowMs = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();

    const clientData = ipCache.get(ip);

    if (!clientData || now > clientData.resetTime) {
      ipCache.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (clientData.count >= limit) {
      return res.status(429).json({
        error: 'Too many requests, please try again later.',
      });
    }

    clientData.count += 1;
    next();
  };
};

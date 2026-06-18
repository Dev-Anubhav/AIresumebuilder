import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    avatarColor: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  // Accept Bearer token or cookie
  let token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Check if passed via cookies (we support HTTP-Only or simple bearer header)
    const cookies = req.headers.cookie;
    if (cookies) {
      const tokenCookie = cookies
        .split(';')
        .find((c) => c.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-here';
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, avatarColor: true },
    });

    if (!user) {
      return res.status(403).json({ error: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

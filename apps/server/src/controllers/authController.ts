import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from '../lib/prisma.js';
import { signupSchema, loginSchema } from '../validators/schema.js';
import { AuthRequest } from '../middleware/auth.js';

const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export const signup = async (req: Request, res: Response) => {
  try {
    const parse = signupSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors[0]?.message || 'Invalid credentials input' });
    }

    const { email, name, password } = parse.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarColor = colors[Math.floor(Math.random() * colors.length)] || '#6366f1';

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        avatarColor,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarColor: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-here',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );


    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({ user, token });
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: err.message || 'Signup failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid login details' });
    }

    const { email, password } = parse.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-here',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );


    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarColor: user.avatarColor,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({ user: userResponse, token });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};

export const me = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.status(200).json({ user: req.user });
};

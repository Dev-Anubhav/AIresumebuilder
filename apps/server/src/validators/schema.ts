import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});


export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const messageSchema = z.object({
  content: z.string().min(1),
});

export const annotationSchema = z.object({
  pageNumber: z.number().int().positive(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  text: z.string().min(1),
  color: z.string().optional(),
});

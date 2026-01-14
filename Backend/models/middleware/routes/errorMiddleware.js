export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

import { z } from 'zod';

export const validateUser = (req, res, next) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be 6+ characters")
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  next();
};
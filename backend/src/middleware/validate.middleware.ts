import type { NextFunction, Request, Response } from 'express';
import { z, type ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return next(new Error(JSON.stringify(errors)));
    }

    req.body = result.data;
    next();
  };
};

export const createValidationError = (field: string, issue: string) =>
  z.object({ [field]: z.string().min(1, issue) });

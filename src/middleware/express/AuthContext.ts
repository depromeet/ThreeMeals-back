import { Request, Response } from 'express';

export interface AuthContext {
  req: Request;
  res: Response;
  payload?: { id: string; iat: string };
}

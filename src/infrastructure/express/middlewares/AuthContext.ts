import { Request, Response } from 'express';
import { Account } from '../../../entities/Account';

export interface AuthPayload {
    id: string;
    iat: number;
}

export const isAuthPayload = (payload: any): payload is AuthPayload => {
    return payload.id && typeof payload.id === 'string' &&
        payload.iat && typeof payload.iat === 'number';
};

export interface AuthContext {
    req: Request;
    res: Response;
    account?: Account;
}

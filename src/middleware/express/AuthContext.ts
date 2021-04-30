import { Request, Response } from 'express';
import { Account } from '../../entities/Account';

export interface AuthPayload {
    id: string;
    iat: string;
}

export const isAuthPayload = (payload: any): payload is AuthPayload => {
    return payload.id && typeof payload.id === 'string' &&
        payload.iat && typeof payload.iat === 'string';
};

export interface AuthContext {
    req: Request;
    res: Response;
    account: Account;
}

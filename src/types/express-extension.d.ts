import {} from 'express';

declare global {
    namespace Express {
        export interface Request {
            userAgent: {
                ip: string;
                os: string;
                browser: string;
            }
            verifiedUser?: {
                id: string;
                iss: string;
                iat: number;
                exp: number;
            }
        }
    }
}

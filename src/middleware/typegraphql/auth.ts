import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { AuthContext } from '../express/AuthContext';

export const isAuth: MiddlewareFn<AuthContext> = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    if (!authorization) {
        throw new Error('Not authenticated');
    }
    try {
        const isBearer = authorization.split(' ')[0] === 'Bearer';
        if (!isBearer) {
            throw new Error('Not authenticated');
        }

        const jwtToken = authorization.split(' ')[1];
        const payload = verify(jwtToken, process.env.JWT_SECRET || 'threemeal');

        context.payload = payload as any;
    } catch (err) {
        console.log(err);
        throw new Error('Not authenticated');
    }
    return next();
};

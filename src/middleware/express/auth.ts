import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { MyContext } from './mycontext';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    // console.log(authorization);
    if (!authorization) {
        throw new Error('Not authenticated');
    }
    try {
        const payload = verify(authorization, process.env.JWT_SECRET || 'threemeal');
        // console.log(payload);
        context.payload = payload as any;
        // console.log(context.payload);
    } catch (err) {
        console.log(err);
        throw new Error('Not authenticated');
    }
    return next();
};

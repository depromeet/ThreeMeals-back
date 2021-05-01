import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { AuthContext, isAuthPayload } from '../express/AuthContext';
import { config } from '../../config';
import { AccountService } from '../../services/AccountService';
import { Service } from 'typedi';

@Service()
export class AuthMiddleware implements MiddlewareInterface<AuthContext> {
    constructor(private readonly accountService: AccountService) {}

    async use({ context, info }: ResolverData<AuthContext>, next: NextFn) {
        try {
            // production 이 아니라면 테스트를 위해 jwt 없이 진행 가능
            if (config.server.env !== 'production' && context.req.headers['account-id']) {
                const id = context.req.headers['account-id'] as string;
                context.account = await this.accountService.getAccount(id);
                return next();
            }

            const authorization = context.req.headers['authorization'];
            if (!authorization) {
                console.log('has not authorization header');
                throw new Error('Not authenticated');
            }

            const isBearer = authorization.split(' ')[0] === 'Bearer';
            if (!isBearer) {
                console.log('Not Bearer');
                throw new Error('Not authenticated');
            }

            const jwtToken = authorization.split(' ')[1];
            const payload = verify(jwtToken, config.jwt.secret);
            if (!payload || typeof payload === 'string' || !isAuthPayload(payload)) {
                console.log(`failed to load payload data`);
                throw new Error('Not authenticated');
            }

            context.account = await this.accountService.getAccount(payload.id);
            return next();
        } catch (err) {
            console.log(err);
            throw new Error('Not authenticated');
        }
    }
}


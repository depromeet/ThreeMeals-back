import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { AuthContext, isAuthPayload } from '../../express/middlewares/AuthContext';
import { config } from '../../../config';
import { AccountRepository } from '../../repositories/AccountRepository';

@Service()
export class AuthMiddleware implements MiddlewareInterface<AuthContext> {
    constructor(
        private readonly accountRepository: AccountRepository,
    ) {}

    async use({ context, info }: ResolverData<AuthContext>, next: NextFn) {
        try {
            // production 이 아니라면 테스트를 위해 jwt 없이 진행 가능
            if (config.server.env !== 'production' && context.req.headers['account-id']) {
                const id = context.req.headers['account-id'] as string;
                const account = await this.accountRepository.findOneById(id);
                if (!account) {
                    console.log(`cannot find account by id, ${id}`);
                    throw new Error('Not authenticated');
                }
                context.account = account;
                return next();
            }

            // authorization 헤더가 없다면 그냥 넘김
            const authorization = context.req.headers['authorization'];
            if (!authorization) {
                return next();
            }

            // authorization 헤더가 있다면 account 를 체크함
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

            const account = await this.accountRepository.findOneById(payload.id);
            if (!account) {
                console.log(`cannot find account by id, ${payload.id}`);
                throw new Error('Not authenticated');
            }
            context.account = account;
            return next();
        } catch (err) {
            console.log(err);
            throw new Error('Not authenticated');
        }
    }
}

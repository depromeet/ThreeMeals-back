// import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { AuthContext, AuthJwtContext, isAuthPayload } from '../../express/middlewares/AuthContext';
import { config } from '../../../config';
import { AccountRepository } from '../../repositories/AccountRepository';
import { ExpressMiddlewareInterface } from 'routing-controllers';

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
    constructor(
        private readonly accountRepository: AccountRepository,
    ) {
    }

    // async use({ context, info }: any, next: any) {
    async use(req: any, res: any, next: (err?: any) => any): Promise<any> {
        try {
            // production 이 아니라면 테스트를 위해 jwt 없이 진행 가능
            if (config.server.env !== 'production' && req.headers['account-id']) {
                const id = req.headers['account-id'] as string;
                const account = await this.accountRepository.findOneById(id);
                if (!account) {
                    console.log(`cannot find account by id, ${id}`);
                    throw new Error('Not authenticated');
                }
                req.account = account;
                return next();
            }

            // authorization 헤더가 없다면 그냥 넘김
            const authorization = req.headers['authorization'];
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
            req.account = account;
            return next();
        } catch (err) {
            console.log(err);
            throw new Error('Not authenticated');
        }
    }
}

@Service()
export class AuthJwtMiddleware implements ExpressMiddlewareInterface {
    async use(req: any, res: any, next: (err?: any) => any): Promise<any> {

        // async use({ context, info }: ResolverData<AuthJwtContext>, next: NextFn) {
        try {
            // production 이 아니라면 테스트를 위해 jwt 없이 진행 가능
            if (config.server.env !== 'production' && req.headers['account-id']) {
                req.accountId = req.headers['account-id'] as string;
                return next();
            }

            // authorization 헤더가 없다면 그냥 넘김
            const authorization = req.headers['authorization'];
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
            req.accountId = payload.id;
            return next();
        } catch (err) {
            console.log(err);
            throw new Error('Not authenticated');
        }
    }
}

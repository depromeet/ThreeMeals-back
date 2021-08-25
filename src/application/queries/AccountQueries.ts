import { Service } from 'typedi';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { AccountRepository } from '../../infrastructure/repositories/AccountRepository';

@Service()
export class AccountQueries {
    constructor(
        private readonly accountRepository: AccountRepository,
    ) {}

    async getAccountInfo(args: {
        accountId: string,
    }): Promise<AccountOrmEntity> {
        const account = await this.accountRepository.findOneById(args.accountId);
        if (!account) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }
        return account;
    }
}

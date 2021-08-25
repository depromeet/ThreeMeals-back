import { Service } from 'typedi';
import { getManager } from 'typeorm';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';

@Service()
export class AccountQueries {
    get accountAlias(): string {
        return 'account';
    }

    async getAccountInfo(args: {
        accountId: string,
    }): Promise<AccountOrmEntity> {
        const account = await getManager().createQueryBuilder(AccountOrmEntity, this.accountAlias)
            .leftJoinAndSelect(`${this.accountAlias}.snsInfos`, 'snsInfos')
            .where(`${this.accountAlias}.id = :id`, { id: args.accountId })
            .getOne();

        if (!account) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }
        return account;
    }
}

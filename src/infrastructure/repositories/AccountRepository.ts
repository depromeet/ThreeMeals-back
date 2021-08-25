import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { IAccountRepository } from '../../domain/aggregates/account/IAccountRepository';
import { Account } from '../../domain/aggregates/account/Account';

@Service()
export class AccountRepository extends BaseRepository<AccountOrmEntity> implements IAccountRepository {
    async saveAccount(newAccount: AccountOrmEntity): Promise<AccountOrmEntity> {
        return await this.entityManager.save(AccountOrmEntity, newAccount);
    }

    // async getAccount(providerId: string): Promise<AccountOrmEntity | undefined> {
    //     const account = await this.entityManager.findOne(AccountOrmEntity, { providerId: providerId }, { select: ['id'] });
    //
    //     return account;
    // }

    async findOneById(id: string): Promise<AccountOrmEntity | undefined> {
        const account = await this.entityManager.findOne(AccountOrmEntity, { id: id });
        return account;
    }


    // for abstract repository
    async add(account: Account): Promise<void> {
        this.dbContext && this.dbContext.addDomainEntity(account);
        await this.entityManager.save(AccountOrmEntity, account);
    }

    async save(account: Account): Promise<void> {
        await this.entityManager.save(AccountOrmEntity, account);
    }

    async findOneByProviderId(providerId: string): Promise<Account | undefined> {
        const accountAlias = 'account';
        const account = await this.entityManager.createQueryBuilder(AccountOrmEntity, accountAlias)
            .select()
            .where(`${accountAlias}.provider_id = :providerId`, { providerId })
            .getOne();
        account && this.dbContext && this.dbContext.addDomainEntity(account);
        return account;
    }
}

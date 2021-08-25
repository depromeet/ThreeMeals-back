import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { Service } from 'typedi';
import { BaseRepository } from '../type-orm/BaseRepository';
import { IAccountRepository } from '../../domain/aggregates/account/IAccountRepository';
import { Account } from '../../domain/aggregates/account/Account';

@Service()
export class AccountRepository extends BaseRepository<AccountOrmEntity> implements IAccountRepository {
    async findOneById(id: string): Promise<AccountOrmEntity | undefined> {
        const accountAlias = 'account';
        const account = await this.entityManager.createQueryBuilder(AccountOrmEntity, accountAlias)
            .leftJoinAndSelect(`${accountAlias}.snsInfos`, 'snsInfos')
            .select()
            .where(`${accountAlias}.id = :id`, { id })
            .getOne();
        account && this.dbContext && this.dbContext.addDomainEntity(account);
        return account;
    }

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
            .leftJoinAndSelect(`${accountAlias}.snsInfos`, 'snsInfos')
            .select()
            .where(`${accountAlias}.provider_id = :providerId`, { providerId })
            .getOne();
        account && this.dbContext && this.dbContext.addDomainEntity(account);
        return account;
    }
}

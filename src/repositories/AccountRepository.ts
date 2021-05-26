import { EntityRepository } from 'typeorm';
import { Account } from '../entities/Account';
import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';

@Service()
@EntityRepository(Account)
export class AccountRepository extends BaseRepository<Account> {
    async saveAccount(newAccount: Account): Promise<Account> {
        return await this.entityManager.save(newAccount);
    }

    async getAccount(providerId: string): Promise<Account | undefined> {
        const account = await this.findOne({ providerId: providerId }, { select: ['id'] });

        return account;
    }

    async findOneById(id: string): Promise<Account | undefined> {
        const account = await this.findOne({ id: id });
        return account;
    }

    async getAccountId(accountId: string): Promise<Account | undefined> {
        const account = await this.findOne(accountId, { select: ['id'] });

        return account;
    }
}

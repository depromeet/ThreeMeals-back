import { Account } from '../../entities/Account';
import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';

@Service()
export class AccountRepository extends BaseRepository<Account> {
    async saveAccount(newAccount: Account): Promise<Account> {
        return await this.entityManager.save(Account, newAccount);
    }

    async getAccount(providerId: string): Promise<Account | undefined> {
        const account = await this.entityManager.findOne(Account, { providerId: providerId }, { select: ['id'] });

        return account;
    }

    async findOneById(id: string): Promise<Account | undefined> {
        const account = await this.entityManager.findOne(Account, { id: id });
        return account;
    }
}

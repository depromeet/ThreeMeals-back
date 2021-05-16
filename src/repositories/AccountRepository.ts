import { Repository, EntityRepository } from 'typeorm';
import { Account } from '../entities/Account';
import { Provider } from '../entities/Enums';
import { Service } from 'typedi';

@Service()
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
    async createAccount(newAccount: Account): Promise<Account> {
        return await this.manager.save(newAccount);
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

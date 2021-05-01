import { Repository, EntityRepository } from 'typeorm';
import { Account } from '../entities/Account';
import { Provider } from '../entities/Enums';
import { Service } from 'typedi';

// todo : 카카오에서 넘어오는 객체 타입 정해줘야됨
interface accountInfo {
    id: string;
    nickname: string;
    // eslint-disable-next-line camelcase
    profileImg: string;
}

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

    async getAccountById(userId: number): Promise<Account | undefined> {
        const account = await this.findOne(
            {
                id: userId,
            },
            { select: ['id'] },
        );
        return account;
    }

    async getAccountId(accountId: string): Promise<Account | undefined> {
        const account = await this.findOne(accountId, { select: ['id'] });

        return account;
    }
}

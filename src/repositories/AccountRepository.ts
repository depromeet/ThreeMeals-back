import { Repository, EntityRepository } from 'typeorm';
import { Account } from '../entities/account/Account';
import { Provider } from '../types/Enums';
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

    async isExistedAccount(providerId: string): Promise<boolean> {
        const account = await this.findOne({ providerId: providerId });
        if (account) return true;
        else return false;
    }
}

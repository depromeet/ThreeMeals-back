import { Repository, EntityRepository } from 'typeorm';
import { Account } from '../entities/account/Account';

interface accountInfo {
    id: string;
    nickname: string;
    // eslint-disable-next-line camelcase
    profileImg: string;
}
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
    async createAccount(arg: accountInfo): Promise<Account> {
        const account = new Account();
        account.nickname = arg.nickname;
        account.provider = 'KAKAO';
        account.providerId = arg.id;
        account.status = 'active';
        account.image = arg.profileImg;

        return this.manager.save(account);
    }
}

import { Repository, EntityRepository } from 'typeorm';
import { Account } from '../entities/account/Account';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
    async createAccount(username: string, email: string): Promise<Account> {
        const user = new Account();
        return this.manager.save(user);
    }
}

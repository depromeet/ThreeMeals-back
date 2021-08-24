import { Account } from './Account';

export abstract class IAccountRepository {
    abstract save(account: Account): Promise<void>
    abstract add(account: Account): Promise<void>
    abstract findOneById(id: string): Promise<Account | undefined>
    abstract findOneByProviderId(providerId: string): Promise<Account | undefined>
}

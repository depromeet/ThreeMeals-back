import { CommandExecuter, ICommandExecuter } from '../Command';
import { DeregisterSnsCommand } from './DeregisterSnsCommand';
import { IAccountRepository } from '../../../domain/aggregates/account/IAccountRepository';
import { Account } from '../../../domain/aggregates/account/Account';
import { IUnitOfWork } from '../../../domain/common/IUnitOfWork';
import BaseError from '../../../exceptions/BaseError';
import { ERROR_CODE } from '../../../exceptions/ErrorCode';

@CommandExecuter(DeregisterSnsCommand)
export class DeregisterSnsCommandExecuter implements ICommandExecuter<DeregisterSnsCommand> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly accountRepository: IAccountRepository,
    ) {}

    async execute(command: DeregisterSnsCommand): Promise<Account> {
        return this.unitOfWork.withTransaction(async () => {
            const { snsType, accountId } = command;

            const account = await this.accountRepository.findOneById(accountId);
            if (!account) {
                throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
            }

            account.deregisterSNSInfo(snsType);

            await this.accountRepository.save(account);
            return account;
        });
    }
}

import { CommandExecuter, ICommandExecuter } from '../../Command';
import { RegisterSnsCommand } from './RegisterSnsCommand';
import { IAccountRepository } from '../../../../domain/aggregates/account/IAccountRepository';
import { Account } from '../../../../domain/aggregates/account/Account';
import { IUnitOfWork } from '../../../../domain/common/IUnitOfWork';
import BaseError from '../../../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../../../domain/exceptions/ErrorCode';

@CommandExecuter(RegisterSnsCommand)
export class RegisterSnsCommandExecuter implements ICommandExecuter<RegisterSnsCommand> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly accountRepository: IAccountRepository,
    ) {}

    async execute(command: RegisterSnsCommand): Promise<Account> {
        return this.unitOfWork.withTransaction(async () => {
            const { snsType, snsId, url, accountId } = command;

            const account = await this.accountRepository.findOneById(accountId);
            if (!account) {
                throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
            }

            account.registerSNSInfo(snsType, snsId, url);

            await this.accountRepository.save(account);
            return account;
        });
    }
}

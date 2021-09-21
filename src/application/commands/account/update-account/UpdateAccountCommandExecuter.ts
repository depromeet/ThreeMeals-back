import { CommandExecuter, ICommandExecuter } from '../../Command';
import { UpdateAccountCommand } from './UpdateAccountCommand';
import { IAccountRepository } from '../../../../domain/aggregates/account/IAccountRepository';
import { Account } from '../../../../domain/aggregates/account/Account';
import { IUnitOfWork } from '../../../../domain/common/IUnitOfWork';
import BaseError from '../../../../exceptions/BaseError';
import { ERROR_CODE } from '../../../../exceptions/ErrorCode';

@CommandExecuter(UpdateAccountCommand)
export class UpdateAccountCommandExecuter implements ICommandExecuter<UpdateAccountCommand> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly accountRepository: IAccountRepository,
    ) {}

    async execute(command: UpdateAccountCommand): Promise<Account> {
        return this.unitOfWork.withTransaction(async () => {
            const { nickname, content, accountId } = command;

            const account = await this.accountRepository.findOneById(accountId);
            if (!account) {
                throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
            }
            nickname && account.changeNickname(nickname);
            content && account.changeContent(content);


            await this.accountRepository.save(account);
            return account;
        });
    }
}

import { CommandExecuter, ICommandExecuter } from '../Command';
import { DeleteAccountImageCommand } from './DeleteAccountImageCommand';
import { IAccountRepository } from '../../../domain/aggregates/account/IAccountRepository';
import { Account } from '../../../domain/aggregates/account/Account';
import { IUnitOfWork } from '../../../domain/common/IUnitOfWork';
import BaseError from '../../../exceptions/BaseError';
import { ERROR_CODE } from '../../../exceptions/ErrorCode';
import { ProfileImageUploader } from '../../../domain/aggregates/account/ProfileImageUploader';

@CommandExecuter(DeleteAccountImageCommand)
export class DeleteAccountImageCommandExecuter implements ICommandExecuter<DeleteAccountImageCommand> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly profileImageUploader: ProfileImageUploader,
        private readonly accountRepository: IAccountRepository,
    ) {}

    async execute(command: DeleteAccountImageCommand): Promise<Account> {
        return this.unitOfWork.withTransaction(async () => {
            const { accountId } = command;

            const account = await this.accountRepository.findOneById(accountId);
            if (!account) {
                throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
            }
            account.deleteImage();

            await this.accountRepository.save(account);
            return account;
        });
    }
}

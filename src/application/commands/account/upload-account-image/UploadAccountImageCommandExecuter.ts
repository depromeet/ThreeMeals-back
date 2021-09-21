import { v4 as uuidV4 } from 'uuid';
import { CommandExecuter, ICommandExecuter } from '../../Command';
import { UploadAccountImageCommand } from './UploadAccountImageCommand';
import { IAccountRepository } from '../../../../domain/aggregates/account/IAccountRepository';
import { Account } from '../../../../domain/aggregates/account/Account';
import { IUnitOfWork } from '../../../../domain/common/IUnitOfWork';
import BaseError from '../../../../exceptions/BaseError';
import { ERROR_CODE } from '../../../../exceptions/ErrorCode';
import { ProfileImageUploader } from '../../../../domain/aggregates/account/ProfileImageUploader';

@CommandExecuter(UploadAccountImageCommand)
export class UploadAccountImageCommandExecuter implements ICommandExecuter<UploadAccountImageCommand> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly profileImageUploader: ProfileImageUploader,
        private readonly accountRepository: IAccountRepository,
    ) {}

    async execute(command: UploadAccountImageCommand): Promise<Account> {
        return this.unitOfWork.withTransaction(async () => {
            const { accountId, imageData } = command;

            const account = await this.accountRepository.findOneById(accountId);
            if (!account) {
                throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
            }

            const fileExt = imageData.filename.substring(
                imageData.filename.lastIndexOf('.'),
                imageData.filename.length,
            );
            await account.uploadImage(this.profileImageUploader, {
                ...imageData,
                filename: `${account.id}/${uuidV4().toString()}${fileExt}`,
            });

            console.log(account);
            await this.accountRepository.save(account);
            return account;
        });
    }
}

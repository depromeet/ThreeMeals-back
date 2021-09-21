import { CommandExecuter, ICommandExecuter } from '../../Command';
import { SignInCommand } from './SignInCommand';
import { IFetchProviderUser } from '../../../services/fetch-provider-user/IFetchProviderUser';
import { IAccountRepository } from '../../../../domain/aggregates/account/IAccountRepository';
import { Account } from '../../../../domain/aggregates/account/Account';
import { Provider } from '../../../../domain/aggregates/account/Provider';
import { IUnitOfWork } from '../../../../domain/common/IUnitOfWork';
import { issueJWT } from '../../../../util/jwt';
import { Logger } from '../../../../infrastructure/typedi/decorator/Logger';
import { ILogger } from '../../../../infrastructure/logger/ILogger';

@CommandExecuter(SignInCommand)
export class SignInCommandExecuter implements ICommandExecuter<SignInCommand> {
    constructor(
        @Logger() private readonly logger: ILogger,
        private readonly unitOfWork: IUnitOfWork,
        private readonly fetchProviderUser: IFetchProviderUser,
        private readonly accountRepository: IAccountRepository,
    ) {}

    async execute(command: SignInCommand): Promise<string> {
        return this.unitOfWork.withTransaction(async () => {
            const { token, providerType } = command;

            this.logger.info('SignInCommand executed', { provider: providerType });

            const {
                providerId,
                nickname,
            } = await this.fetchProviderUser.fetch({ token, provider: providerType });

            const existedAccount = await this.accountRepository.findOneByProviderId(providerId);
            if (existedAccount) {
                this.logger.info('SignInCommand executed success with existed user', { account: existedAccount });
                return issueJWT(existedAccount.id);
            }

            const account = new Account(
                nickname,
                new Provider(providerType, providerId),
            );
            await this.accountRepository.add(account);

            this.logger.info('SignInCommand executed success with new user', { account });
            return issueJWT(account.id);
        });
    }
}

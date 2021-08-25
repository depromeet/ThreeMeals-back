import { CommandExecuter, ICommandExecuter } from '../Command';
import { SignInCommand } from './SignInCommand';
import { IFetchProviderUser } from '../../services/fetch-provider-user/IFetchProviderUser';
import { IAccountRepository } from '../../../domain/aggregates/account/IAccountRepository';
import { Account } from '../../../domain/aggregates/account/Account';
import { Provider } from '../../../domain/aggregates/account/Provider';
import { IUnitOfWork } from '../../../domain/common/IUnitOfWork';
import { issueJWT } from '../../../util/jwt';

@CommandExecuter(SignInCommand)
export class SignInCommandExecuter implements ICommandExecuter<SignInCommand> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly fetchProviderUserData: IFetchProviderUser,
        private readonly accountRepository: IAccountRepository,
    ) {}

    async execute(command: SignInCommand): Promise<string> {
        return this.unitOfWork.withTransaction(async () => {
            const { token, providerType } = command;

            const {
                providerId,
                nickname,
                profileImage,
            } = await this.fetchProviderUserData
                .fetchUserData({ token, provider: providerType });

            const existedAccount = await this.accountRepository.findOneByProviderId(providerId);
            if (existedAccount) {
                return issueJWT(existedAccount.id);
            }

            const account = new Account(
                nickname,
                new Provider(providerType, providerId),
                profileImage,
            );
            await this.accountRepository.add(account);
            return issueJWT(account.id);
        });
    }
}

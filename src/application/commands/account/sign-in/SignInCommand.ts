import { ICommand } from '../../Command';
import { ProviderType } from '../../../../domain/aggregates/account/ProviderType';

export class SignInCommand implements ICommand {
    public readonly token: string;
    public readonly providerType: ProviderType;

    constructor(args: {
        token: string,
        providerType: ProviderType,
    }) {
        this.token = args.token;
        this.providerType = args.providerType;
    }
}

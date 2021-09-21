import { ICommand } from '../../Command';
import { ProviderType } from '../../../../domain/aggregates/account/ProviderType';

export class UpdateAccountCommand implements ICommand {
    public readonly nickname?: string;
    public readonly content?: string;
    public readonly accountId: string;

    constructor(args: {
        nickname?: string;
        content?: string;
        accountId: string;
    }) {
        this.nickname = args.nickname;
        this.content = args.content;
        this.accountId = args.accountId;
    }
}

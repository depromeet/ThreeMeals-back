import { ICommand } from '../../Command';
import { SNSType } from '../../../../domain/aggregates/account/SNSType';

export class RegisterSnsCommand implements ICommand {
    public readonly snsType: SNSType;
    public readonly snsId: string;
    public readonly url: string;
    public readonly accountId: string;

    constructor(args: {
        snsType: SNSType,
        snsId: string,
        url: string,
        accountId: string;
    }) {
        this.snsType = args.snsType;
        this.snsId = args.snsId;
        this.url = args.url;
        this.accountId = args.accountId;
    }
}

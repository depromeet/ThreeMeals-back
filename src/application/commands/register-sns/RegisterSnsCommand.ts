import { ICommand } from '../Command';
import { SNSType } from '../../../domain/aggregates/account/SNSType';

export class RegisterSnsCommand implements ICommand {
    public readonly snsType: SNSType;
    public readonly url: string;
    public readonly accountId: string;

    constructor(args: {
        snsType: SNSType,
        url: string,
        accountId: string;
    }) {
        this.snsType = args.snsType;
        this.url = args.url;
        this.accountId = args.accountId;
    }
}

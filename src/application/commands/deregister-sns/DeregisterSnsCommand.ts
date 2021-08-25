import { ICommand } from '../Command';
import { SNSType } from '../../../domain/aggregates/account/SNSType';

export class DeregisterSnsCommand implements ICommand {
    public readonly snsType: SNSType;
    public readonly accountId: string;

    constructor(args: {
        snsType: SNSType,
        accountId: string;
    }) {
        this.snsType = args.snsType;
        this.accountId = args.accountId;
    }
}

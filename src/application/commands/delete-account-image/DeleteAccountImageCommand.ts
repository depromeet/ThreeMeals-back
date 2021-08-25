import { ICommand } from '../Command';

export class DeleteAccountImageCommand implements ICommand {
    public readonly accountId: string;

    constructor(args: {
        accountId: string
    }) {
        this.accountId = args.accountId;
    }
}

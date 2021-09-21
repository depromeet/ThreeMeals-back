import { ICommand } from '../../Command';
import { ProfileImageData } from '../../../../domain/aggregates/account/ProfileImageUploader';

export class UploadAccountImageCommand implements ICommand {
    public readonly accountId: string;
    public readonly imageData: ProfileImageData;

    constructor(args: {
        accountId: string;
        imageData: ProfileImageData;
    }) {
        this.imageData = args.imageData;
        this.accountId = args.accountId;
    }
}

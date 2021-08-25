import { IValueObject } from '../../common/IValueObject';

export class LikePost implements IValueObject {
    accountId: string;

    constructor(accountId: string) {
        this.accountId = accountId;
    }
}

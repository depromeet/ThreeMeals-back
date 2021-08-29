import { IValueObject } from '../../common/IValueObject';
import { SNSType } from './SNSType';

export class SNSInfo implements IValueObject {
    snsType: SNSType;
    snsId: string;
    url: string;

    constructor(snsType: SNSType, snsId: string, url: string) {
        this.snsType = snsType;
        this.snsId = snsId;
        this.url = url;
    }
}

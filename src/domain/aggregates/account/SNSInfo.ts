import { IValueObject } from '../../common/IValueObject';
import { SNSType } from './SNSType';

export class SNSInfo implements IValueObject {
    snsType: SNSType;
    url: string;

    constructor(snsType: SNSType, url: string) {
        this.snsType = snsType;
        this.url = url;
    }
}

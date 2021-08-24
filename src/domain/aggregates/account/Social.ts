import { IValueObject } from '../../common/IValueObject';
import { SocialType } from './SocialType';

export class Social implements IValueObject {
    socialType: SocialType;
    url: string;

    constructor(socialType: SocialType, url: string) {
        this.socialType = socialType;
        this.url = url;
    }
}

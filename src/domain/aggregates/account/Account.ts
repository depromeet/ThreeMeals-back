import { AggregateRoot } from '../../common/AggregateRoot';
import { Provider } from './Provider';
import { Social } from './Social';
import { SocialType } from './SocialType';

export class Account extends AggregateRoot {
    id!: string;
    logInProvider: Provider;
    nickname: string;
    status: string;
    image: string | null;
    content: string | null;
    socials!: Social[];

    constructor(nickname: string, logInProvider: Provider, image?: string) {
        super();
        this.nickname = nickname;
        this.logInProvider = logInProvider;
        this.status = 'active';
        this.image = image ? image : null;
        this.content = null;
    }

    public addSocial(socialType: SocialType, url: string): void {
        this.socials ?
            this.socials.push(new Social(socialType, url)) :
            this.socials = [new Social(socialType, url)];
    }
}

import { Provider } from './Provider';
import { AggregateRoot } from '../../common/AggregateRoot';

export class Account extends AggregateRoot {
    id!: string;
    nickname!: string;
    logInProvider!: Provider;
    status!: string;
    image!: string | null;
    content!: string | null;
    instagramUrl!: string | null;

    constructor(id: string, nickname: string, logInProvider: Provider, image: string | null) {
        super();
        this.id = id;
        this.nickname = nickname;
        this.logInProvider = logInProvider;
        this.status = 'active';
        this.image = image;
        this.content = '';
        this.instagramUrl = null;
    }
}

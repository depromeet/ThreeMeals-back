import { AggregateRoot } from '../../common/AggregateRoot';
import { Provider } from './Provider';
import { Social } from './Social';
import { SocialType } from './SocialType';
import { ProfileImageData, ProfileImageUploader } from './ProfileImageUploader';

export type ProfileUrl = string;

export class Account extends AggregateRoot {
    id!: string;
    provider: Provider;
    nickname: string;
    status: string;
    image: ProfileUrl | null;
    content: string | null;
    socials!: Social[];
    createdAt!: Date;
    updatedAt!: Date;

    constructor(nickname: string, provider: Provider, image?: string) {
        super();
        this.nickname = nickname;
        this.provider = provider;
        this.status = 'active';
        this.image = image ? image : null;
        this.content = null;
    }

    public registerSocial(socialType: SocialType, url: string): void {
        this.socials ?
            this.socials.push(new Social(socialType, url)) :
            this.socials = [new Social(socialType, url)];
    }

    public changeNickname(nickname: string): void {
        this.nickname = nickname;
    }

    public changeContent(content: string): void {
        this.content = content;
    }

    public async uploadImage(profileImageUploader: ProfileImageUploader, data: ProfileImageData): Promise<void> {
        const profileUrl = await profileImageUploader.uploadProfileImage(data);
        this.image = profileUrl;
    }

    public deleteImage(): void {
        this.image = null;
    }
}

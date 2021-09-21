import { remove } from 'lodash';
import { AggregateRoot } from '../../common/AggregateRoot';
import { Provider } from './Provider';
import { SNSInfo } from './SNSInfo';
import { SNSType } from './SNSType';
import { ProfileImageData, ProfileImageUploader } from './ProfileImageUploader';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';

export type ProfileUrl = string;

export class Account extends AggregateRoot {
    id!: string;
    provider: Provider;
    nickname: string;
    status: string;
    image: ProfileUrl | null;
    content: string | null;
    snsInfos!: SNSInfo[];
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

    public registerSNSInfo(snsType: SNSType, snsId: string, url: string): void {
        this.snsInfos && this.verifyRegisteredSNSInfo(snsType);
        this.snsInfos ?
            this.snsInfos.push(new SNSInfo(snsType, snsId, url)) :
            this.snsInfos = [new SNSInfo(snsType, snsId, url)];
    }

    public deregisterSNSInfo(snsType: SNSType): void {
        this.snsInfos && remove(this.snsInfos, (snsInfo) => snsType === snsInfo.snsType);
    }

    public verifyRegisteredSNSInfo(snsType: SNSType): void {
        if (this.snsInfos.map((sns) => sns.snsType).includes(snsType)) {
            throw new BaseError(ERROR_CODE.SNS_ALREADY_REGISTERED);
        }
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

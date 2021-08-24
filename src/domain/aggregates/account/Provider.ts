import { IValueObject } from '../../common/IValueObject';

export enum ProviderType {
    Kakao = 'Kakao',
}

export class Provider implements IValueObject {
    provider: ProviderType;
    providerId: string;

    constructor(provider: ProviderType, providerId: string) {
        this.provider = provider;
        this.providerId = providerId;
    }
}

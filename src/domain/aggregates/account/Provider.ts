import { IValueObject } from '../../common/IValueObject';
import { ProviderType } from './ProviderType';

export class Provider implements IValueObject {
    provider: ProviderType;
    providerId: string;

    constructor(provider: ProviderType, providerId: string) {
        this.provider = provider;
        this.providerId = providerId;
    }
}

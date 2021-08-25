import { ProviderType } from '../../../domain/aggregates/account/ProviderType';

export interface ProviderUserInfo {
    nickname: string;
    providerId: string;
    profileImage?: string;
}

export abstract class IFetchProviderUser {
    abstract fetch(args: { token: string, provider: ProviderType }): Promise<ProviderUserInfo>
}

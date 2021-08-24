import { ProviderType } from '../../../domain/aggregates/account/ProviderType';

export interface SocialUserData {
    nickname: string;
    providerId: string;
    profileImage?: string;
}

export abstract class IFetchProviderUserData {
    abstract fetchUserData(args: { token: string, provider: ProviderType }): Promise<SocialUserData>
}

import {
    IFetchProviderUser,
    ProviderUserInfo,
} from '../../application/services/fetch-provider-user/IFetchProviderUser';
import { ProviderType } from '../../domain/aggregates/account/ProviderType';
import { KakaoApi } from './KakaoApi';

export class FetchProviderUser implements IFetchProviderUser {
    private readonly kakaoApi: KakaoApi;
    constructor() {
        this.kakaoApi = new KakaoApi();
    }

    async fetch(args: { token: string; provider: ProviderType }): Promise<ProviderUserInfo> {
        switch (args.provider) {
        case ProviderType.Kakao:
            return this.kakaoApi.getUser(args.token);
        default:
            throw new Error('this provider does not supported');
        }
    }
}

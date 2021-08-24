import axios from 'axios';
import { IFetchProviderUserData, SocialUserData } from './IFetchProviderUserData';
import { ProviderType } from '../../../domain/aggregates/account/ProviderType';

export class FetchProviderUserData implements IFetchProviderUserData {
    async fetchUserData(args: { token: string; provider: ProviderType }): Promise<SocialUserData> {
        switch (args.provider) {
        case ProviderType.Kakao:
            const userData = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: 'Bearer ' + args.token,
                },
            });
            return {
                nickname: userData.data.properties.nickname,
                profileImage: userData.data.properties.profile_image ? userData.data.properties.profile_image : undefined,
                providerId: userData.data.id,
            };
        default:
            throw new Error('this provider does not supported');
        }
    }
}

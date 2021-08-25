import axios from 'axios';
import { ProviderUserInfo } from '../../application/services/fetch-provider-user/IFetchProviderUser';

export class KakaoApi {
    async getUser(token: string): Promise<ProviderUserInfo> {
        const userData = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return {
            nickname: userData.data.properties.nickname,
            profileImage: userData.data.properties.profile_image ? userData.data.properties.profile_image : undefined,
            providerId: userData.data.id,
        };
    }
}

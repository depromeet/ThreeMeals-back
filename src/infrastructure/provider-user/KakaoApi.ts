import axios from 'axios';
import { ProviderUserInfo } from '../../application/services/fetch-provider-user/IFetchProviderUser';

export const KAKAO_URL = {
    BASE_PATH: 'https://kapi.kakao.com',
    ME: '/v2/user/me',
};

export class KakaoApi {
    async getUser(token: string): Promise<ProviderUserInfo> {
        const userData = await axios.get(`${KAKAO_URL.BASE_PATH}${KAKAO_URL.ME}`, {
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

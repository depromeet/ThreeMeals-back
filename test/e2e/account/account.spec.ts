import { TestApp } from '../../TestApp';
import * as request from 'supertest';
import * as nock from 'nock';
import * as faker from 'faker';
import { ProviderType } from '../../../src/domain/aggregates/account/ProviderType';
import { KAKAO_URL } from '../../../src/infrastructure/provider-user/KakaoApi';

describe('AccountResolver', () => {
    let app: TestApp;

    beforeAll(async () => {
        app = new TestApp();
        await app.setUp();
    });

    afterAll(async () => {
        await app.down();
    });

    describe('signIn', () => {
        let kakaoUser: Record<string, any>;

        beforeEach(() => {
            kakaoUser = {
                id: faker.random.alphaNumeric(16),
                properties: {
                    profile_image: faker.image.avatar(),
                    nickname: faker.name.jobType(),
                    thumbnail_image: faker.image.cats(),
                },
                kakao_account: {},
            };
        });

        it('카카오 로그인에 성공하면 토큰을 발행한다.', async () => {
            // given
            nock(KAKAO_URL.BASE_PATH)
                .get(KAKAO_URL.ME)
                .reply(200, kakaoUser);
            const variables = {
                accessToken: 'abc',
                provider: ProviderType.Kakao,
            };
            const query = `
            mutation signIn($accessToken: String!, $provider: String!) {
                signIn(accessToken: $accessToken, provider: $provider) {
                    token
                }
            }
            `;

            // when
            const { status, body } = await request(app.instance)
                .post('/graphql')
                .send({ query, variables });

            // then
            expect(status).toBe(200);
            expect(body.data.signIn.token).toBeDefined();
        });
    });
});

import { registerEnumType } from 'type-graphql';
enum Provider {
    Kakao,
}

registerEnumType(Provider, {
    name: 'Provider',
    description: '소셜 로그인 어디꺼에요',
});
export { Provider };

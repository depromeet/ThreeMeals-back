import { registerEnumType } from 'type-graphql';

// Account - Provider
enum Provider {
    Kakao = 'Kakao',
}

registerEnumType(Provider, {
    name: 'Provider',
    description: '소셜 로그인 어디꺼에요',
});

//  Post - PostType
enum PostType {
    question = 'question',
    answer = 'answer',
}

registerEnumType(PostType, {
    name: 'PostType',
    description: '물어봐 / 답해줘',
});

//  Post - postState
enum PostState {
    submitted = 'submitted',
    answered = 'answered',
    deleted = 'deleted',
}

registerEnumType(PostState, {
    name: 'PostState',
    description: 'Post 상태',
});


//  Post - secretType
enum SecretType {
    temp = 'temp',
    forever = 'forever',
}

registerEnumType(SecretType, {
    name: 'SecretType',
    description: '익명 여부',
});


export { Provider, PostType, PostState, SecretType };

import { registerEnumType } from 'type-graphql';

// Account - Provider
enum Provider {
    Kakao,
}

registerEnumType(Provider, {
    name: 'Provider',
    description: '소셜 로그인 어디꺼에요',
});

//  Post - PostType
enum PostType {
    QUESTION = 'question',
    ANSWER = 'answer',
}

registerEnumType(PostType, {
    name: 'PostType',
    description: '물어봐 / 답해줘',
});

//  Post - State
enum State {
    SUBMITTED = 'submitted',
    ANSWERED = 'answered',
    DELETED = 'deleted',
}

registerEnumType(State, {
    name: 'State',
    description: 'Post 상태',
});


export { Provider, PostType, State };

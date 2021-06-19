import { registerEnumType } from 'type-graphql';

// Account - Provider
export enum Provider {
    Kakao = 'Kakao',
}

registerEnumType(Provider, {
    name: 'Provider',
    description: '소셜 로그인 벤더사 (Kakao)',
});

//  Post - PostType
export enum PostType {
    Ask = 'Ask',
    Answer = 'Answer',
    Quiz = 'Quiz',
}

registerEnumType(PostType, {
    name: 'PostType',
    description: '물어봐 / 답해줘 / OX 퀴즈',
});

//  Post - postState
export enum PostState {
    Submitted = 'Submitted',
    Completed = 'Completed',
    Deleted = 'Deleted',
}

registerEnumType(PostState, {
    name: 'PostState',
    description: 'Post 상태',
});

//  Post - secretType
export enum SecretType {
    Temp = 'Temp',
    Forever = 'Forever',
}

registerEnumType(SecretType, {
    name: 'SecretType',
    description: '익명 여부',
});

export enum NotiType {
    LikeToMine = 'LikeToMine', // 함
    AnswerToMine = 'AnswerToMine',
    PostToMe = 'PostToMe', // 함
    CommentToMe = 'CommentToMe',
}
// 남이 내 글에 좋아요
// 남이 내 글에 댓글
// 남이 나한테 물어봐
// 남이 나한테 ox
registerEnumType(NotiType, {
    name: 'NotiType',
    description: '알림 타입',
});

//  Post - postState
export enum CommentState {
    Submitted = 'Submitted',
    Deleted = 'Deleted',
}

registerEnumType(CommentState, {
    name: 'CommentState',
    description: 'Comment 상태',
});

export enum OXComment {
    O = 'O',
    X = 'X',
}

registerEnumType(OXComment, {
    name: 'OXComment',
    description: 'OX 답변내용',
});

import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class LikeCommentArgument {
    @Field()
    postId!: string;

    @Field()
    commentId!: string;
}

import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class LikePostsArgument {
    @Field()
    postId!: string;
}

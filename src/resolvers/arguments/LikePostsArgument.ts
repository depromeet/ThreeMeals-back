/* eslint-disable camelcase */
import { IsEnum, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class LikePostsArgument {
    @Field()
    postId!: number;
}

import { ArgsType, Field } from 'type-graphql';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginatedArgument } from './base/PaginatedArgument';
import { PostState, PostType } from '../../entities/Enums';

@ArgsType()
export class GetPostsArgument extends PaginatedArgument(String) {
    @IsString({
        message: 'invalid after argument',
    })
    @IsOptional()
    after?: string;

    @Field(() => PostType, { nullable: true })
    @IsEnum(PostType, {
        message: 'invalid postType argument',
    })
    @IsOptional()
    postType?: PostType;

    @Field(() => PostState, { nullable: true })
    @IsEnum(PostState, {
        message: 'invalid postState argument',
    })
    @IsOptional()
    postState?: PostState;

    @Field(() => String)
    @IsNumberString({}, {
        message: 'invalid accountId argument',
    })
    accountId!: string;
}

@ArgsType()
export class GetMyNewPostCount {
    @Field(() => PostType, { nullable: true })
    @IsEnum(PostType, {
        message: 'invalid postType argument',
    })
    @IsOptional()
    postType?: PostType;
}

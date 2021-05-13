import { ArgsType, Field } from 'type-graphql';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginatedArgument } from './base/PaginatedArgument';
import { PostType } from '../../entities/Enums';

@ArgsType()
export class GetMyPostsArgument extends PaginatedArgument(String) {
    @IsString({
        message: 'invalid after argument',
    })
    @IsOptional()
    after?: string;

    @Field(() => PostType, {nullable: true})
    @IsEnum(PostType, {
        message: 'invalid postType argument',
    })
    @IsOptional()
    postType!: PostType;
}


@ArgsType()
export class GetPostsArgument extends PaginatedArgument(String) {
    @IsString({
        message: 'invalid after argument',
    })
    @IsOptional()
    after?: string;

    @Field(() => PostType, {nullable: true})
    @IsEnum(PostType, {
        message: 'invalid postType argument',
    })
    @IsOptional()
    postType!: PostType;

    @Field(() => String)
    @IsNumberString({}, {
        message: 'invalid accountId argument',
    })
    accountId!: string;
}

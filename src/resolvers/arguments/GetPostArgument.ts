import { ArgsType, Field } from 'type-graphql';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginatedArgument } from './PaginatedArgument';
import { PostType } from '../../entities/Enums';

@ArgsType()
export class GetMyPostArgument extends PaginatedArgument(String) {
    @IsString({
        message: 'invalid after argument',
    })
    after!: string;

    @Field(() => PostType, {nullable: true})
    @IsEnum(PostType, {
        message: 'invalid postType argument',
    })
    @IsOptional()
    postType!: PostType;
}


@ArgsType()
export class GetPostArgument extends PaginatedArgument(String) {
    @IsString({
        message: 'invalid after argument',
    })
    after!: string;

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
    @IsOptional()
    accountId!: string;
}

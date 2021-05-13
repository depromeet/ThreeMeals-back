import { ArgsType, Field } from 'type-graphql';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginatedArgument } from './base/PaginatedArgument';

@ArgsType()
export class GetCommentsArgument extends PaginatedArgument(String) {
    @IsString({
        message: 'invalid after argument',
    })
    @IsOptional()
    after?: string;

    @Field(() => String)
    @IsNumberString({}, {
        message: 'invalid postId argument',
    })
    postId!: string;

    @Field(() => String, { nullable: true })
    @IsNumberString({}, {
        message: 'invalid parentId argument',
    })
    @IsOptional()
    parentId?: string;
}

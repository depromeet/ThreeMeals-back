import { ArgsType, Field } from 'type-graphql';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginatedArgument } from './base/PaginatedArgument';

@ArgsType()
export class GetChildrenCommentsArgument extends PaginatedArgument(String) {
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

    @Field(() => String)
    @IsNumberString({}, {
        message: 'invalid parentId argument',
    })
    parentId!: string;
}

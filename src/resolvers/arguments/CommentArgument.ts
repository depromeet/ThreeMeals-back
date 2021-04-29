import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class CreateCommentArgs {
    @IsString({
        message: 'invalid type',
    })
    @Field()
    content!: string;

    @IsNumber()
    @Field()
    postId!: number;
}

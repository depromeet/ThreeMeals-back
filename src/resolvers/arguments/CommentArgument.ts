import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';
import { SecretType } from '../../entities/Enums';
@ArgsType()
export class CreateCommentArgs {
    @IsString({
        message: 'invalid type',
    })
    @Field()
    content!: string;

    @IsEnum(SecretType, {
        message: 'type of secret',
    })
    @Field((type) => String)
    secretType!: SecretType;

    @IsNumber()
    @Field()
    postId!: number;
}

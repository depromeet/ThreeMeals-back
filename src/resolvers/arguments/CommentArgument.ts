import { IsNumberString, IsEnum, IsNumber, IsString } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';
import {SecretType} from "../../entities/Enums";

@ArgsType()
export class CreateCommentArgs {
    @IsString({
        message: 'invalid type',
    })
    @Field()
    content!: string;

    @IsNumberString()
    @Field()
    postId!: string;

    @IsEnum(SecretType, {
        message: 'invalid secret type',
    })
    @Field((type) => String)
    secretType!: SecretType;
}

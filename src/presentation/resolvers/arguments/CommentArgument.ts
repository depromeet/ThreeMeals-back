import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { SecretType } from '../../../entities/Enums';

@ArgsType()
export class CreateCommentArgs {
    @IsNumberString()
    @Field()
    postId!: string;

    @Field({ nullable: true })
    @IsNumberString()
    @IsOptional()
    parentId?: string;

    @IsString({
        message: 'invalid type',
    })
    @Field()
    content!: string;

    @IsEnum(SecretType, {
        message: 'invalid secret type',
    })
    @Field((type) => String)
    secretType!: SecretType;
}

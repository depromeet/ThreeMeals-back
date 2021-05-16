import { IsNumberString, IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';
import { SecretType } from '../../entities/Enums';

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

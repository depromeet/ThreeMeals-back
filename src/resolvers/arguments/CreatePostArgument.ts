import { IsEnum, IsString, IsHexColor } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';
import { PostType, SecretType } from '../../entities/Enums';
import { CreateEmoticonArgument } from './CreateEmoticonArgument';

@ArgsType()
export class CreatePostArgument {
    @IsString({
        message: 'invalid type',
    })
    @Field()
    content!: string;

    @IsString({
        message: 'invalid type',
    })
    @Field()
    toAccountId!: string;

    @IsHexColor({
        message: 'not color',
    })
    @IsString({
        message: 'invalid type',
    })
    @Field()
    color!: string;

    @IsEnum(SecretType, {
        message: 'invalid secret type',
    })
    @Field((type) => String)
    secretType!: SecretType;

    @IsEnum(PostType, {
        message: 'invalid post type',
    })
    @Field((type) => String)
    postType!: PostType;

    @Field(() => [CreateEmoticonArgument])
    emoticons!: CreateEmoticonArgument[]
}

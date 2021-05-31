import { IsEnum, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';


@ArgsType()
export class updateAccountInfoArgument {
    @IsString({
        message: 'invalid type',
    })
    @Field()
    nickname!: string;

    @IsString({
        message: 'invalid type',
    })
    @Field({ nullable: true })
    content!: string;

    @IsString({
        message: 'invalid type',
    })
    @Field({ nullable: true })
    profileUrl!: string;
}

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';


@ArgsType()
export class updateAccountInfoArgument {
    @IsString({
        message: 'invalid type',
    })
    @IsOptional()
    @Field({ nullable: true })
    nickname?: string;

    @IsString({
        message: 'invalid type',
    })
    @IsOptional()
    @Field({ nullable: true })
    content?: string;

    @IsString({
        message: 'invalid type',
    })
    @IsOptional()
    @Field({ nullable: true })
    instagramUrl?: string;
}

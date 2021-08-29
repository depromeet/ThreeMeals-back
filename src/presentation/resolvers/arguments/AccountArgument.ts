import { IsOptional, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';


@ArgsType()
export class UpdateAccountInfoArgument {
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
}

import { IsEnum, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { SNSType } from '../../../domain/aggregates/account/SNSType';

@ArgsType()
export class RegisterSnsInfoArgument {
    @IsString({
        message: 'invalid url',
    })
    @Field()
    url!: string;

    @IsEnum(SNSType, {
        message: 'invalid sns type',
    })
    @Field((type) => String)
    snsType!: SNSType;
}

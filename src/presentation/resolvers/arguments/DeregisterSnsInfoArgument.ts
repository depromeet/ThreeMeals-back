import { IsEnum } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { SNSType } from '../../../domain/aggregates/account/SNSType';

@ArgsType()
export class DeregisterSnsInfoArgument {
    @IsEnum(SNSType, {
        message: 'invalid sns type',
    })
    @Field((type) => String)
    snsType!: SNSType;
}

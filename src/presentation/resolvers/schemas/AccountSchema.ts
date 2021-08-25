import { Field, ID, ObjectType } from 'type-graphql';
import { SNSInfo } from '../../../domain/aggregates/account/SNSInfo';
import { SNSType } from '../../../domain/aggregates/account/SNSType';

@ObjectType('SNSInfo')
export class SNSInfoSchema {
    @Field(() => ID)
    id!: string;

    @Field((type) => SNSType)
    snsType!: SNSType;

    @Field()
    url!: string;
}

@ObjectType('Account')
export class AccountSchema {
    @Field(() => ID)
    id!: string;

    @Field()
    nickname!: string;

    @Field()
    status!: string;

    @Field(() => String, { nullable: true })
    image!: string | null;

    @Field(() => String, { nullable: true })
    content!: string | null;

    @Field(() => String, { nullable: true })
    profileUrl!: string | null;

    @Field(() => [SNSInfoSchema])
    snsInfos!: SNSInfo[];

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}

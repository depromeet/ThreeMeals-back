import {ArgsType, Field} from 'type-graphql';

@ArgsType()
export class InsertUserArgument {
    @Field({nullable: true})
    nickname?: string;

    @Field()
    password!: string;
}

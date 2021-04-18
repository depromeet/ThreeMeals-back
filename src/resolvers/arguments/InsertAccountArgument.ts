import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class InsertAccountArgument {
    @Field()
    username!: string;

    @Field()
    email!: string;
}

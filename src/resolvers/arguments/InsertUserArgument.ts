import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class InsertUserArgument {
  @Field()
  username!: string;

  @Field()
  email!: string;
}

import { ObjectType, Field, Int, ID } from 'type-graphql';

@ObjectType()
export class Token {
    @Field()
    token!: string;
}

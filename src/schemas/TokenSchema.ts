import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
@ObjectType()
export class Token {
    @Field()
    token!: string;
}

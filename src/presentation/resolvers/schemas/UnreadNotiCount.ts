import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class NotiCount {
    @Field()
    count!: number;
}

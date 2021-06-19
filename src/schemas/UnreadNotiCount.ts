import { Field, ObjectType } from 'type-graphql';
import { PostType } from '../entities/Enums';

@ObjectType()
export class NotiCount {
    @Field()
    count!: number;
}

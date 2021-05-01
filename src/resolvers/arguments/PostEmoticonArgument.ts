/* eslint-disable camelcase */
import { IsEnum, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class PostEmoticonArgument {
    @Field({ nullable: true })
    positionX!: number;

    @Field({ nullable: true })
    positionY!: number;

    @Field({ nullable: true })
    rotate!: number;
}

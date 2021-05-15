import { IsString } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class createContactArguments {
    @IsString({
        message: 'invalid type',
    })
    @Field()
    content!: string;
}

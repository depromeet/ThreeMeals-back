import {IsNumber, IsOptional, IsString} from 'class-validator';
import { ArgsType, ClassType, Field } from 'type-graphql';

export function PaginatedArgument<T>(afterType: ClassType<T>) {
    @ArgsType()
    class PaginatedArgumentClass {
        @IsNumber({
            allowInfinity: false,
            allowNaN: false,
        }, {
            message: 'invalid first argument',
        })
        @Field()
        first!: number;

        @Field((type) => afterType, { nullable: true })
        after?: T;
    }
    return PaginatedArgumentClass;
}

@ArgsType()
export class StringPaginatedArgument extends PaginatedArgument(String) {
    @IsString({
        message: 'invalid after argument',
    })
    @IsOptional()
    after?: string;
}

import { IsNumber, IsOptional, IsString } from 'class-validator';

export function PaginatedDto<T>() {
    class PaginatedDtoClass {
        @IsNumber({
            allowInfinity: false,
            allowNaN: false,
        }, {
            message: 'invalid first argument',
        })
        first!: number;
        after?: T;
    }

    return PaginatedDtoClass;
}


export class StringPaginatedArgument extends PaginatedDto() {
    @IsString({
        message: 'invalid after argument',
    })
    @IsOptional()
    after?: string;
}

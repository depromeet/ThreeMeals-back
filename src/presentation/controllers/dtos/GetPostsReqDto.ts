import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PostState, PostType } from '../../../entities/Enums';
import { PaginatedDto } from './PaginatedDto';

export class GetPostsReqDto extends PaginatedDto() {
    @IsString({
        message: 'invalid after argument',
    })
    @IsOptional()
    after?: string;

    @IsEnum(PostType, {
        message: 'invalid postType argument',
    })
    @IsOptional()
    postType?: PostType;

    @IsEnum(PostState, {
        message: 'invalid postState argument',
    })
    @IsOptional()
    postState?: PostState;

    @IsNumberString({}, {
        message: 'invalid accountId argument',
    })
    accountId!: string;
}

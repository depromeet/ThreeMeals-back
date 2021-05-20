import { IsNumberString, IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';
import { NotiType, PostType } from '../../entities/Enums';
import { Account } from '../../entities/Account';
import { Post } from '../../entities/Post';

@ArgsType()
export class CreateNotificationArgs {
    @IsNumberString()
    @Field()
    relatedPost!: Post;

    @Field((type) => Account)
    account!: Account;

    @Field((type) => Account)
    otherAccount!: Account;

    @IsEnum(NotiType, {
        message: 'invalid Noti type',
    })
    @Field((type) => NotiType)
    notiType!: NotiType;

    // @IsEnum(PostType, {
    //     message: 'invalid Post type',
    // })
    // @Field((type) => String)
    // postType!: PostType;
}

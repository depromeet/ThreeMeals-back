import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';
import { Field, ID, ObjectType } from 'type-graphql';
import { isEnum, IsHexColor } from 'class-validator';
import { AccountOrmEntity } from './AccountOrmEntity';
import { Comment } from './Comment';
import { PostEmoticon } from './PostEmoticon';
import { LikePost } from './LikePost';
import { OXComment, PostState, PostType, SecretType } from './Enums';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { AggregateRoot } from '../domain/common/AggregateRoot';
import { PostCreatedEvent } from '../domain/events/PostCreatedEvent';
import { AccountSchema } from '../presentation/resolvers/schemas/AccountSchema';

@ObjectType()
@Entity('post')
export class Post extends AggregateRoot {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('text')
    content!: string;

    // Enum
    @Field((type) => PostType)
    @Column('varchar', { name: 'post_type' })
    postType!: PostType;

    // Enum
    @Field((type) => PostState)
    @Column('varchar', { name: 'post_state' })
    postState!: PostState;

    // class-validator - color인지
    @Field()
    @IsHexColor()
    @Column('varchar')
    color!: string;

    @Field((type) => SecretType)
    @Column('varchar', { name: 'secret_type' })
    secretType!: SecretType;

    @Field((type) => Date, { nullable: true })
    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt!: Date | null;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Field((type) => Number)
    @Column('integer', { name: 'comments_count', default: 0 })
    commentsCount!: number;

    @Column({ name: 'from_account_id', type: 'bigint', unsigned: true })
    fromAccountId!: string;

    // Account와 N:1 관계
    @Field(() => AccountSchema, { nullable: true })
    @ManyToOne((type) => AccountOrmEntity, (account) => account.writePosts)
    @JoinColumn({ name: 'from_account_id', referencedColumnName: 'id' })
    fromAccount!: AccountOrmEntity | null;

    @Column({ name: 'to_account_id', type: 'bigint', unsigned: true })
    toAccountId!: string;

    @Field(() => AccountSchema)
    @ManyToOne((type) => AccountOrmEntity, (account) => account.receivePosts)
    @JoinColumn({ name: 'to_account_id', referencedColumnName: 'id' })
    toAccount!: AccountOrmEntity | null;

    // LikePosts 1:N 관계
    @Field(() => [LikePost])
    @OneToMany((type) => LikePost, (likeposts) => likeposts.post)
    likedPosts!: LikePost[];

    // PostEmoticon과 1:N
    @Field(() => [PostEmoticon])
    @OneToMany(() => PostEmoticon, (postEmoticon) => postEmoticon.post, { cascade: ['insert', 'update'] })
    usedEmoticons!: PostEmoticon[];

    // Comment와 1:N관계
    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[];

    static create(args: {
        content: string,
        color: string,
        secretType: SecretType,
        postType: PostType,
        fromAccountId: string,
        toAccountId: string,
    }): Post {
        const post = new Post();
        post.content = args.content;
        post.color = args.color;
        post.postState = PostState.Submitted;
        post.secretType = args.secretType;
        post.postType = args.postType;
        post.fromAccountId = args.fromAccountId;
        post.toAccountId = args.toAccountId;
        return post;
    }

    // id 를 save 이후에 알 수 있어 create events 의 경우 따로 등록해준다.
    addCreatedEvent(): void {
        this.addEvent(new PostCreatedEvent({
            id: this.id,
            content: this.content,
            fromAccountId: this.fromAccountId,
            postState: this.postState,
            postType: this.postType,
            toAccountId: this.toAccountId,
        }));
    }

    addEmoticons(postEmoticons: PostEmoticon[]): void {
        if (!this.usedEmoticons) this.usedEmoticons = [];
        this.usedEmoticons.push(...postEmoticons);
    }

    public hideFromAccount(accountId: string | null): void {
        // 본인의 작성글이라면 null 처리 하지 않음
        if (accountId && accountId === this.fromAccountId) {
            return;
        }
        // secretType == forever 인지 확인
        if (this.secretType === SecretType.Forever) {
            this.fromAccount = null;
        }

        // ~ 24 시간이면 null
        if (!this.completedAt) {
            this.fromAccount = null;
        } else {
            if (dayjs(this.completedAt).add(1, 'day').isAfter(dayjs(Date.now()))) {
                this.fromAccount = null;
            }

            // 48 ~ 시간이면 null
            if (dayjs(this.completedAt).add(2, 'day').isBefore(dayjs(Date.now()))) {
                this.fromAccount = null;
            }
        }
    }

    public delete(removerId: string): void {
        if (![this.toAccountId, this.fromAccountId].includes(removerId)) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED, `unauthorized delete post with this removerId: ${removerId}`);
        }
        this.postState = PostState.Deleted;
    }

    public answer(answererId: string, commentContent: string, isUniqueComment: boolean): void {
        // post 가 삭제된 상태인 경우 에러
        if (this.postState === PostState.Deleted) {
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND, 'DELETED POST');
        }

        // postType 이 물어봐인경우
        if (this.postType === PostType.Ask) {
            // 답변 다는 사람이 내가 아니라면 에러
            if (answererId !== this.toAccountId) {
                throw new BaseError(ERROR_CODE.UNAUTHORIZED_WRITE_COMMENT, '물어봐에는 내가 아닌사람이 쓸 수 없음');
            }

            // comment 를 이미 달았다면 에러
            if (!isUniqueComment) {
                throw new BaseError(ERROR_CODE.ALREADY_COMMENT_SUBMITTED, `이미 답변 달음, postId: ${this.id}`);
            }
        }

        // postType 이 OX 인 경우
        if (this.postType === PostType.Quiz) {
            // 답변 다는 사람이 내가 아니라면 에러
            if (answererId !== this.toAccountId) {
                throw new BaseError(ERROR_CODE.UNAUTHORIZED_WRITE_COMMENT, `OX 에는 다른사람이 쓸 수 없음`);
            }

            // 답변이 O,X 가 아니라면 에러
            if (!isEnum(commentContent, OXComment)) {
                throw new BaseError(ERROR_CODE.INVALID_OX_COMMENT_CONTENT, `OX 에는 OX 만이 들어갈 수 있음, content: ${commentContent}`);
            }

            // comment 를 이미 달았다면 에러
            if (!isUniqueComment) {
                throw new BaseError(ERROR_CODE.ALREADY_COMMENT_SUBMITTED, `이미 답변 달음, postId: ${this.id}`);
            }
        }

        this.completedAt = new Date();
        this.postState = PostState.Completed;
    }
}

import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { AccountOrmEntity } from './AccountOrmEntity';
import { Post } from './Post';
import { LikeComment } from './LikeComment';
import { CommentState, SecretType } from './Enums';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { DomainEntity } from '../domain/common/DomainEntity';

@ObjectType()
@Entity('comment')
export class Comment extends DomainEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('text')
    content!: string;

    @Field((type) => SecretType)
    @Column('varchar', { name: 'secret_type', default: SecretType.Forever })
    secretType!: SecretType;

    @Field((type) => CommentState)
    @Column('varchar', { name: 'comment_state' })
    commentState!: CommentState;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // @Column({ name: 'account_id', type: 'bigint', unsigned: true })
    @RelationId((comment: Comment) => comment.account)
    accountId!: string;

    // Account와 N:1 관계
    @Field((type) => AccountOrmEntity, { nullable: true })
    @ManyToOne((type) => AccountOrmEntity, (account) => account.writeComments)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account!: AccountOrmEntity | null;

    @Field()
    // @RelationId((comment: Comment) => comment.post)
    @Column({ name: 'post_id', type: 'bigint', unsigned: true })
    postId!: string;

    // Post와 N:1 관계
    @ManyToOne((type) => Post, (post) => post.comments)
    @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
    post!: Post | null;

    // LikeComments 1:N 관계
    @Field(() => [LikeComment])
    @OneToMany((type) => LikeComment, (likecomments) => likecomments.comment)
    likedComments!: LikeComment[];

    // Comment 내에서 self join
    @OneToMany((type) => Comment, (comment) => comment.parent)
    @Field((type) => [Comment])
    children!: Comment[];

    @Field((type) => Number)
    childrenCount!: number;

    @Field(() => String, { nullable: true })
    @RelationId((comment: Comment) => comment.parent)
    parentId!: string | null;

    @ManyToOne((type) => Comment, (comment) => comment.children, { nullable: true }) // null 가능
    @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
    parent!: Comment | null;

    public delete(removerId: string): void {
        if (this.accountId !== removerId) {
            throw new BaseError(ERROR_CODE.FORBIDDEN);
        }

        this.commentState = CommentState.Deleted;
    }

    public validateParentComment(postId: string): void {
        // parent 가 이미 대댓글이라면 에러
        if (this.parentId) {
            throw new BaseError(ERROR_CODE.COMMENT_NOT_PARENT, `부모댓글이 대댓글입니다. parentId: ${this.parentId}`);
        }
        // parent post id 가 다른 post id 라면 에러
        if (this.postId !== postId) {
            throw new BaseError(
                ERROR_CODE.INVALID_MATCH_COMMENT_POST,
                `요청한 postId 와 부모 댓글 postId 가 다릅니다. postId: ${postId}, commentPostId: ${this.postId}`,
            );
        }
    }
}

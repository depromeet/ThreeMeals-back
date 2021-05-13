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
import { Account } from './Account';
import { Post } from './Post';
import { LikeComments } from './LikeComments';
import { CommentState, SecretType } from './Enums';

@ObjectType()
@Entity()
export class Comment {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('text')
    content!: string;

    @Field((type) => SecretType)
    @Column('varchar', { name: 'secret_type' })
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

    @RelationId((comment: Comment) => comment.account)
    accountId!: string;

    // Account와 N:1 관계
    @Field((type) => Account)
    @ManyToOne((type) => Account, (account) => account.writeComments)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account!: Account;

    @RelationId((comment: Comment) => comment.post)
    postId!: string;

    // Post와 N:1 관계
    @ManyToOne((type) => Post, (post) => post.comments)
    @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
    post!: Post;

    // LikeComments 1:N 관계
    @OneToMany((type) => LikeComments, (likecomments) => likecomments.comment)
    likedComments!: LikeComments[];

    // Comment 내에서 self join
    @Field((type) => [Comment])
    @OneToMany((type) => Comment, (comment) => comment.parent)
    children!: Comment[];

    @RelationId((comment: Comment) => comment.parent)
    parentId!: string | null;

    @ManyToOne((type) => Comment, (comment) => comment.children, { nullable: true }) // null 가능
    @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
    parent!: Comment | null;
}

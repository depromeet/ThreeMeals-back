// eslint-disable-next-line max-len
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { Account } from './Account';
import { Post } from './Post';
import { LikeComments } from './LikeComments';

@ObjectType()
@Entity()
export class Comment {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('text')
    content!: string;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // Account와 N:1 관계
    @ManyToOne((type) => Account, (account) => account.writeComments)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account!: Account;

    // Post와 N:1 관계
    @Field((type) => Post)
    @ManyToOne((type) => Post, (post) => post.comments)
    @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
    post!: Post;

    // LikeComments 1:N 관계
    @OneToMany((type) => LikeComments, (likecomments) => likecomments.comment)
    likedComments!: LikeComments[];

    // Comment 내에서 self join
    @OneToMany((type) => Comment, (comment) => comment.parent)
    children!: Comment[];

    @ManyToOne((type) => Comment, (comment) => comment.children, { nullable: true }) // null 가능
    @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
    parent!: Comment;
}

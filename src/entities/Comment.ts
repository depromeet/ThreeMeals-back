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
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('text')
    content!: string;

    @Field()
    @Column('varchar', { length: 20 })
    secretType!: string;

    @Field()
    @CreateDateColumn({})
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({})
    updatedAt!: Date;

    // Account와 N:1 관계
    @ManyToOne((type) => Account, (account) => account.writeComments)
    @JoinColumn({ name: 'accountId' })
    account!: Account;

    // Post와 N:1 관계
    @ManyToOne((type) => Post, (post) => post.comments)
    @JoinColumn({ name: 'postId' })
    post!: Post;

    // LikeComments 1:N 관계
    @OneToMany((type) => LikeComments, (likecomments) => likecomments.comment)
    likedcomments!: LikeComments[]

    // Comment 내에서 self join
    @OneToMany((type) => Comment, (comment) => comment.parent)
    children!: Comment[];

    @ManyToOne((type) => Comment, (comment) => comment.children, { nullable: true } ) // null 가능
    @JoinColumn({ name: 'parentId' })
    parent!: Comment;
}

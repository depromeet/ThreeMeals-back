// eslint-disable-next-line max-len
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { Account } from '../account/Account';
import { Post } from './Post';
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

    // @ManyToOne((type) => Account, (account) => account.id)
    // accountId!: Account;

    // Post와 1:N 관계
    @ManyToOne((type) => Post, (post) => post.comments)
    @JoinColumn({ name: 'postId' })
    post!: Post;

    // Comment 내에서 self join
    @ManyToOne((type) => Comment, (comment) => comment.children, { nullable: true } ) // null 가능
    @JoinColumn({ name: 'parentId' })
    parent!: Comment;

    @OneToMany((type) => Comment, (comment) => comment.parent)
    children!: Comment[];
}

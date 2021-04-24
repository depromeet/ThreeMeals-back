import { Entity, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from './Account';
import { Post } from './Post';

@ObjectType()
@Entity()
export class LikePosts {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @CreateDateColumn({})
    createdAt!: Date;

    // Account와 N:1 관계
    @ManyToOne((type) => Account, (account) => account.likeposts)
    @JoinColumn({ name: 'accountId' })
    account!: Account;

    // Post와 N:1 관계
    @ManyToOne((type) => Post, (post) => post.likedposts)
    @JoinColumn({ name: 'postId' })
    post!: Post;
}

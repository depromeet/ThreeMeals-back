import { Entity, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from './Account';
import { Post } from './Post';

@ObjectType()
@Entity()
export class LikePosts {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    // Account와 N:1 관계
    @ManyToOne((type) => Account, (account) => account.likePosts)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account?: Account;

    // Post와 N:1 관계
    @ManyToOne((type) => Post, (post) => post.likedPosts)
    @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
    post?: Post;
}

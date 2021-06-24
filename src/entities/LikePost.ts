import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Account } from './Account';
import { Post } from './Post';
import { IValueObject } from '../common/IValueObject';

@ObjectType()
@Entity('like_post')
export class LikePost implements IValueObject {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    // Account와 N:1 관계
    @ManyToOne((type) => Account, (account) => account.likePosts)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account?: Account;

    // Post와 N:1 관계
    @ManyToOne((type) => Post, (post) => post.likedPosts)
    @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
    post?: Post;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}

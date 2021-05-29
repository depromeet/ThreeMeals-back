import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Account } from './Account';
import { Post } from './Post';
import { DomainEntity } from '../common/DomainEntity';

@ObjectType()
@Entity()
export class LikePost extends DomainEntity {
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

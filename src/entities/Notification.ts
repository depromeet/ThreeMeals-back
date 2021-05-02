// eslint-disable-next-line max-len
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { Account } from './Account';
import { Post } from './Post';
import { LikeComments } from './LikeComments';
import { PostType } from './Enums';

@ObjectType()
@Entity()
export class Notification {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Field(() => Account)
    @ManyToOne((type) => Account, (account) => account.notifications)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account!: Account;

    @Field(() => Account, { nullable: true })
    @JoinColumn({ name: 'other_account_id', referencedColumnName: 'id' })
    otherAccount?: Account;

    @Field(() => Post)
    @JoinColumn({ name: 'related_post_id', referencedColumnName: 'id' })
    relatedPost!: Post;

    @Field()
    @Column('varchar', { length: 15 })
    notificationType!: string;

    @Field((type) => PostType)
    @Column('varchar', { name: 'post_type' })
    postType!: PostType;
}

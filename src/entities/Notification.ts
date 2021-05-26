import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    RelationId,
} from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { Account } from './Account';
import { Post } from './Post';
import { LikeComment } from './LikeComment';
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

    @Column({ name: 'account_id', type: 'bigint', unsigned: true })
    accountId!: string;

    @Field(() => Account)
    @ManyToOne((type) => Account, (account) => account.notifications)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account!: Account | null;

    @Column({ name: 'other_account_id', type: 'bigint', unsigned: true })
    otherAccountId!: string;

    @Field(() => Account, { nullable: true })
    @JoinColumn({ name: 'other_account_id', referencedColumnName: 'id' })
    otherAccount!: Account | null;

    @Column({ name: 'related_post_id', type: 'bigint', unsigned: true })
    relatedPostId!: string;

    @Field(() => Post)
    @JoinColumn({ name: 'related_post_id', referencedColumnName: 'id' })
    relatedPost!: Post;

    @Field()
    @Column('varchar', { length: 15 })
    notificationType!: string;
}

import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Account } from './Account';
import { Post } from './Post';
import { NotiType } from './Enums';

@ObjectType()
@Entity('notification')
export class Notification {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Column({ name: 'account_id', type: 'bigint', unsigned: true })
    accountId!: string;

    @Field(() => Account)
    @ManyToOne((type) => Account, (account) => account.notifications)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account!: Account | null;

    @Column({ name: 'other_account_id', type: 'bigint', unsigned: true })
    otherAccountId!: string;

    @Field(() => Account, { nullable: true })
    @ManyToOne(() => Account)
    @JoinColumn({ name: 'other_account_id', referencedColumnName: 'id' })
    otherAccount!: Account | null;

    @Column({ name: 'related_post_id', type: 'bigint', unsigned: true })
    relatedPostId!: string;

    @Field(() => Post)
    @ManyToOne(() => Post)
    @JoinColumn({ name: 'related_post_id', referencedColumnName: 'id' })
    relatedPost!: Post;

    @Field()
    @Column({ name: 'notification_type', type: 'varchar' })
    notificationType!: NotiType;

    @Field({ defaultValue: 0 })
    @Column('boolean', { default: false })
    read!: boolean;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}

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
import { Comment } from './Comment';
import { IValueObject } from '../common/IValueObject';

@ObjectType()
@Entity('like_comment')
export class LikeComment implements IValueObject {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Column({ name: 'account_id', type: 'bigint', unsigned: true })
    accountId!: string;

    // Account와 N:1 관계
    @ManyToOne((type) => Account, (account) => account.likeComments)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account!: Account;

    // Post와 N:1 관계
    @ManyToOne((type) => Comment, (comment) => comment.likedComments)
    @JoinColumn({ name: 'comment_id', referencedColumnName: 'id' })
    comment!: Comment;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}

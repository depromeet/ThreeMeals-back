import { Entity, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from './Account';
import { Comment } from './Comment';

@ObjectType()
@Entity()
export class LikeComment {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    // Account와 N:1 관계
    @ManyToOne((type) => Account, (account) => account.likeComments)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account!: Account;

    // Post와 N:1 관계
    @ManyToOne((type) => Comment, (comment) => comment.likedComments)
    @JoinColumn({ name: 'comment_id', referencedColumnName: 'id' })
    comment!: Comment;
}

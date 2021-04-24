import { Entity, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from './Account';
import { Comment } from './Comment';

@ObjectType()
@Entity()
export class LikeComments {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @CreateDateColumn({})
    createdAt!: Date;

    // Account와 N:1 관계
    @ManyToOne((type) => Account, (account) => account.likecomments)
    @JoinColumn({ name: 'accountId' })
    account!: Account;

    // Post와 N:1 관계
    @ManyToOne((type) => Comment, (comment) => comment.likedcomments)
    @JoinColumn({ name: 'commentId' })
    comment!: Comment;
}

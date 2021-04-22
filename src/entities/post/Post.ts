import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from '../account/Account';
import { Comment } from './Comment';
import { PostEmoticon } from '../PostEmoticon';

@ObjectType()
@Entity()
export class Post {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('text')
    content!: string;

    @Field()
    @Column('varchar', { length: 10, nullable: true }) // null 가능
    postType!: string;

    @Field()
    @Column('boolean')
    state!: boolean;

    @Field()
    @Column('varchar', { length: 20 })
    color!: string;

    @Field()
    @Column('varchar', { length: 20 })
    secretType!: string;

    @Field()
    @CreateDateColumn({})
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({})
    updatedAt!: Date;

    // Account와 1:N 관계
    @ManyToOne((type) => Account, (account) => account.id)
    fromAccountId!: Account;

    @ManyToOne((type) => Account, (account) => account.id)
    toAccountId!: Account;

    // Post와 1:N관계
    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[];

    // PostEmoticon과 1:N
    @OneToMany(() => PostEmoticon, (postEmoticon) => postEmoticon.post)
    usingemoticons!: PostEmoticon[];
}

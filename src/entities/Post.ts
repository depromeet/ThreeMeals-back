import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from './Account';
import { LikePosts } from './LikePosts';
import { Comment } from './Comment';
import { PostEmoticon } from './PostEmoticon';
import { PostType, State } from './Enums';

@ObjectType()
@Entity()
export class Post {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('text')
    content!: string;

    // Enum
    @Field()
    @Column('varchar')
    postType!: PostType;

    // Enum
    @Field()
    @Column('varchar')
    state!: State;

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

    // Account와 N:1 관계
    @ManyToOne((type) => Account, (account) => account.writePosts)
    @JoinColumn({ name: 'fromAccountId' })
    fromAccount!: Account;

    @ManyToOne((type) => Account, (account) => account.receivePosts)
    @JoinColumn({ name: 'toAccountId' })
    toAccount!: Account;

    // LikePosts 1:N 관계
    @OneToMany((type) => LikePosts, (likeposts) => likeposts.post)
    likedposts!: Post[];

    // Comment와 1:N관계
    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[];

    // PostEmoticon과 1:N
    @OneToMany(() => PostEmoticon, (postEmoticon) => postEmoticon.post)
    usingemoticons!: PostEmoticon[];
}

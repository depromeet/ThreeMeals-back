/* eslint-disable camelcase */
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length, IsHexColor } from 'class-validator';
import { Account } from './Account';
import { Comment } from './Comment';
import { PostEmoticon } from './PostEmoticon';
import { LikePosts } from './LikePosts';
import { PostType, PostState, SecretType } from './Enums';

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
    @Field((type) => PostType)
    @Column('varchar', { name: 'post_type' })
    postType!: PostType;

    // Enum
    @Field((type) => PostState)
    @Column('varchar', { name: 'post_state' })
    postState!: PostState;

    // class-validator - color인지
    @Field()
    @IsHexColor()
    @Column('varchar', { length: 20 })
    color!: string;

    // @Field()
    // @Column('varchar', { name: 'secret_type', length: 20 })
    // secretType!: string;

    @Field((type) => SecretType)
    @Column('varchar', { name: 'secret_type' })
    secretType!: SecretType;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // Account와 N:1 관계
    @Column()
    fromAccountId!: number;
    @ManyToOne((type) => Account, (account) => account.writePosts)
    @JoinColumn({ name: 'from_account_id', referencedColumnName: 'id' })
    fromAccount!: Account;

    @ManyToOne((type) => Account, (account) => account.receivePosts)
    @JoinColumn({ name: 'to_account_id', referencedColumnName: 'id' })
    toAccount!: Account;

    // LikePosts 1:N 관계
    @OneToMany((type) => LikePosts, (likeposts) => likeposts.post)
    likedPosts!: Post[];

    // Comment와 1:N관계
    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[];

    // PostEmoticon과 1:N
    @OneToMany(() => PostEmoticon, (postEmoticon) => postEmoticon.post)
    usingEmoticons!: PostEmoticon[];
}

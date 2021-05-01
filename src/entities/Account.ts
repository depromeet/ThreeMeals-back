import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Post } from './Post';
import { Comment } from './Comment';
import { LikePosts } from './LikePosts';
import { LikeComments } from './LikeComments';
import { Provider } from './Enums';

@ObjectType()
@Entity()
export class Account {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('varchar', { length: 8 })
    nickname!: string;

    // Enum
    @Field((type) => Provider)
    @Column('varchar', { length: 8 })
    provider!: Provider;

    @Field()
    @Column('varchar', { name: 'provider_id', length: 20 })
    providerId!: string;

    @Field()
    @Column('varchar', { length: 10 })
    status!: string;

    @Field()
    @Column('text')
    image!: string;

    @Field({ nullable: true })
    @Column('varchar', { length: 50, nullable: true })
    content?: string;

    @Field({ nullable: true, description: 'insta or facebook url' })
    @Column('varchar', { name: 'profile_url', length: 50, nullable: true })
    profileUrl?: string;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // Post와 1:N 관계
    @OneToMany((type) => Post, (post) => post.fromAccount)
    writePosts!: Post[];

    @OneToMany((type) => Post, (post) => post.toAccount)
    receivePosts!: Post[];

    // Comment와 1:N 관계
    @OneToMany((type) => Comment, (comment) => comment.account)
    writeComments!: Comment[];

    // LikePosts 1:N 관계
    @OneToMany((type) => LikePosts, (likeposts) => likeposts.account)
    likePosts!: LikePosts[];

    // LikeComments 1:N 관계
    @OneToMany((type) => LikeComments, (likecomments) => likecomments.account)
    likeComments!: LikeComments[];
}

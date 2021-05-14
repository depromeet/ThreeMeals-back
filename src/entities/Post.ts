import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn, RelationId,
    UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { IsHexColor } from 'class-validator';
import { Account } from './Account';
import { Comment } from './Comment';
import { PostEmoticon } from './PostEmoticon';
import { LikePosts } from './LikePosts';
import { PostState, PostType, SecretType } from './Enums';

@ObjectType()
@Entity()
export class Post {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

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

    @Field((type) => SecretType)
    @Column('varchar', { name: 'secret_type' })
    secretType!: SecretType;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @RelationId((post: Post) => post.fromAccount)
    fromAccountId!: string;

    // Account와 N:1 관계
    @Field(() => Account, { nullable: true })
    @ManyToOne((type) => Account, (account) => account.writePosts)
    @JoinColumn({ name: 'from_account_id', referencedColumnName: 'id' })
    fromAccount!: Account | null;

    @RelationId((post: Post) => post.toAccount)
    toAccountId!: string;

    @Field(() => Account)
    @ManyToOne((type) => Account, (account) => account.receivePosts)
    @JoinColumn({ name: 'to_account_id', referencedColumnName: 'id' })
    toAccount!: Account | null;

    // LikePosts 1:N 관계
    @Field(() => Post)
    @OneToMany((type) => LikePosts, (likeposts) => likeposts.post)
    likedPosts!: Post[];

    // PostEmoticon과 1:N
    @Field(() => [PostEmoticon])
    @OneToMany(() => PostEmoticon, (postEmoticon) => postEmoticon.post)
    usedEmoticons!: PostEmoticon[];

    // Comment와 1:N관계
    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[];

    @Field((type) => Number)
    commentsCount!: number
}

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Contact } from './Contact';
import { Post } from './Post';
import { Comment } from './Comment';
import { LikePost } from './LikePost';
import { LikeComment } from './LikeComment';
import { Notification } from './Notification';
import { Account } from '../domain/aggregates/account/Account';
import { ProviderType } from '../domain/aggregates/account/ProviderType';
import { Social } from '../domain/aggregates/account/Social';
import { SocialType } from '../domain/aggregates/account/SocialType';

export class Provider {
    @Column('varchar')
    provider!: ProviderType;

    @Column('varchar', { name: 'provider_id' })
    providerId!: string;
}

@ObjectType('Social')
@Entity('account_social')
export class SocialOrmEntity extends Social {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field((type) => SocialType)
    @Column('varchar', { name: 'social_type' })
    socialType!: SocialType;

    @Field()
    @Column('varchar')
    url!: string;

    @Column('varchar', { name: 'account_id' })
    accountId!: string;
}

@ObjectType('Account')
@Entity('account')
export class AccountOrmEntity extends Account {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('varchar')
    nickname!: string;

    @Column((type) => Provider, { prefix: false })
    provider!: Provider;

    @Field()
    @Column('varchar')
    status!: string;

    @Field(() => String, { nullable: true })
    @Column('varchar', { nullable: true })
    image!: string | null;

    @Field(() => String, { nullable: true })
    @Column('varchar', { nullable: true })
    content!: string | null;

    @Field(() => [SocialOrmEntity])
    @OneToMany(() => SocialOrmEntity,
        (social) => social.accountId,
        {
            cascade: ['insert', 'update'],
            createForeignKeyConstraints: false,
        },
    )
    socials!: Social[];

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // Contact와 1:N 관계
    @OneToMany((type) => Contact, (contact) => contact.sender)
    writeContacts!: Post[];

    // Post와 1:N 관계
    @OneToMany((type) => Post, (post) => post.fromAccount)
    writePosts!: Post[];

    @OneToMany((type) => Post, (post) => post.toAccount)
    receivePosts!: Post[];

    // Comment와 1:N 관계
    @OneToMany((type) => Comment, (comment) => comment.account)
    writeComments!: Comment[];

    // LikePosts 1:N 관계
    @OneToMany((type) => LikePost, (likeposts) => likeposts.account)
    likePosts!: LikePost[];

    // LikeComments 1:N 관계
    @OneToMany((type) => LikeComment, (likecomments) => likecomments.account)
    likeComments!: LikeComment[];

    @Field(() => Notification)
    @OneToMany((type) => Notification, (notification) => notification.account)
    notifications!: Notification[];
}

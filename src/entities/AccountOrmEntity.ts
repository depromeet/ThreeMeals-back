import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Contact } from './Contact';
import { Post } from './Post';
import { Comment } from './Comment';
import { LikePost } from './LikePost';
import { LikeComment } from './LikeComment';
import { Notification } from './Notification';
import { Account } from '../domain/aggregates/account/Account';
import { ProviderType } from '../domain/aggregates/account/ProviderType';
import { SNSInfo } from '../domain/aggregates/account/SNSInfo';
import { SNSType } from '../domain/aggregates/account/SNSType';

export class Provider {
    @Column('varchar')
    provider!: ProviderType;

    @Column('varchar', { name: 'provider_id' })
    providerId!: string;
}

@Entity('account_sns_info')
export class SNSInfoOrmEntity extends SNSInfo {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Column('varchar', { name: 'sns_type' })
    snsType!: SNSType;

    @Column('varchar')
    url!: string;

    @Column('varchar', { name: 'sns_id' })
    snsId!: string;

    @ManyToOne((type) => AccountOrmEntity, (account) => account.snsInfos)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    accountId!: string;
}

@Entity('account')
export class AccountOrmEntity extends Account {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Column('varchar')
    nickname!: string;

    @Column((type) => Provider, { prefix: false })
    provider!: Provider;

    @Column('varchar')
    status!: string;

    @Column('varchar', { nullable: true })
    image!: string | null;

    @Column('varchar', { nullable: true })
    content!: string | null;

    @Column('varchar', { name: 'profile_url', nullable: true })
    profileUrl!: string | null;

    @OneToMany(() => SNSInfoOrmEntity,
        (social) => social.accountId,
        {
            cascade: ['insert', 'update'],
            createForeignKeyConstraints: false,
        },
    )
    snsInfos!: SNSInfo[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

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

    @OneToMany((type) => Notification, (notification) => notification.account)
    notifications!: Notification[];
}

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { Account } from './Account';
import { Post } from './Post';
@ObjectType()
@Entity()
export class Comment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('text')
    content!: string;

    @Field()
    @Column('varchar', { length: 20 })
    secretType!: string;

    @Field()
    @CreateDateColumn({})
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({})
    updatedAt!: Date;

    @ManyToOne((type) => Account, (account) => account.id)
    accountId!: Account;

    @ManyToOne((type) => Post, (post) => post.id)
    postId!: Post;

    @ManyToOne((type) => Comment, (comment) => comment.childrenId)
    parentId!: Comment;

    @OneToMany((type) => Comment, (comment) => comment.parentId)
    childrenId!: Comment[];
}

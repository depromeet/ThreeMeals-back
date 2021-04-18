import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Post } from '../post/Post';
@ObjectType()
@Entity()
export class Account extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('varchar', { length: 8 })
    nickname!: string;

    @Field()
    @Column('varchar', { length: 8 })
    provider!: string;

    @Field()
    @Column('varchar', { length: 20 })
    providerId!: string;

    @Field()
    @Column('varchar', { length: 10 })
    status!: string;

    @Field()
    @Column('text')
    image!: string;

    @Field()
    @Column('varchar', { length: 50, nullable: true })
    content?: string;

    @Field()
    @CreateDateColumn({})
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({})
    updatedAt!: Date;

    @OneToMany((type) => Post, (post) => post.fromAccountId)
    writePosts!: Post[];

    @OneToMany((type) => Post, (post) => post.toAccountId)
    receivePosts!: Post[];
}

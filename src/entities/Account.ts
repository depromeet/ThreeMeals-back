import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Post } from './Post';
import { Provider } from './Enums';
@ObjectType()
@Entity()
export class Account {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('varchar', { length: 8 })
    nickname!: string;

    @Field()
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
    @Column('varchar', { length: 50, nullable: true })
    profileUrl?: string;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany((type) => Post, (post) => post.fromAccountId)
    writePosts!: Post[];

    @OneToMany((type) => Post, (post) => post.toAccountId)
    receivePosts!: Post[];
}

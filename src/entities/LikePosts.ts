import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from './account/Account';

@ObjectType()
@Entity()
export class LikePosts {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @CreateDateColumn({})
    createdAt!: Date;

    // // accountId, postId 설정 필요
}

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from './account/Account';

@ObjectType()
@Entity()
export class LikeComments {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @CreateDateColumn({})
    createdAt!: Date;

    // accountId, commentId 설정 필요
}

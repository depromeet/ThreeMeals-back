import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from './Account';

enum color {
    Red,
    Green,
    Blue,
    Orange,
    Yellow,
}

enum postType {
    Question,
    Answer,
}
@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('text')
    content!: string;

    @Field()
    @Column('varchar', { length: 10 })
    postType!: postType;

    @Field()
    @Column('boolean')
    state!: boolean; // 답변했냐 안했냐니까 booleanㄱㅊ?

    @Field()
    @Column('varchar', { length: 20 })
    color!: color;

    @Field()
    @Column('varchar', { length: 20 })
    secretType!: string;

    // @Field()
    // @Column('int')
    // fromAccountId!: number;

    // @Field()
    // @Column('int')
    // toAccountId!: number;

    @Field()
    @CreateDateColumn({})
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({})
    updatedAt!: Date;

    @ManyToOne((type) => Account, (account) => account.id)
    fromAccountId!: Account;

    @ManyToOne((type) => Account, (account) => account.id)
    toAccountId!: Account;
}

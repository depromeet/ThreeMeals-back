import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';

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
}
// Container.set('user', User);

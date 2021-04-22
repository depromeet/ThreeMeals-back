import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { PostEmoticon } from './PostEmoticon';

@ObjectType()
@Entity()
export class Emoticon {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('varchar')
    fileUrl!: string;

    @Field()
    @Column('varchar')
    name!: string;

    // PostEmoticon과 1:N
    @OneToMany(() => PostEmoticon, (postemoticon) => postemoticon.emoticon)
    usedemoticons!: PostEmoticon[];
}

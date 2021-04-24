import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Emoticon } from './Emoticon';
import { Post } from './Post';

@ObjectType()
@Entity()
export class PostEmoticon {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('decimal', { precision: 8, scale: 2 })
    positionX!: number;

    @Field()
    @Column('decimal', { precision: 8, scale: 2 })
    positionY!: number;

    @Field()
    @Column('decimal', { precision: 8, scale: 2 })
    rotate!: number;

    // @Field((type) => Int)
    // @Column({ type: 'int' })
    // postId!: number;

    // @Field((type) => Int)
    // @Column({ type: 'int' })
    // emoticonId!: number;


    // Post과 1:N
    @ManyToOne((type) => Post, (post) => post.usingemoticons)
    @JoinColumn({ name: 'postId' })
    post!: Post;

    // Emoticon과 1:N
    @ManyToOne((type) => Emoticon, (emoticon) => emoticon.usedemoticons)
    @JoinColumn({ name: 'emoticonId' })
    emoticon!: Emoticon;
}

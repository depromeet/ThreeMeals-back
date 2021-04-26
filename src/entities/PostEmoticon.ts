import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Post } from './Post';
import { Emoticon } from './Emoticon';


@ObjectType()
@Entity()
export class PostEmoticon {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('float', { precision: 8, scale: 2 })
    positionX!: number;

    @Field()
    @Column('float', { precision: 8, scale: 2 })
    positionY!: number;

    @Field()
    @Column('float', { precision: 8, scale: 2 })
    rotate!: number;

    // @Field((type) => Int)
    // @Column({ type: 'int' })
    // postId!: number;

    // @Field((type) => Int)
    // @Column({ type: 'int' })
    // emoticonId!: number;


    // Post과 N:1
    @ManyToOne((type) => Post, (post) => post.usingEmoticons)
    @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
    post!: Post;

    // Emoticon과 N:1
    @ManyToOne((type) => Emoticon, (emoticon) => emoticon.usedEmoticons)
    @JoinColumn({ name: 'emoticon_id', referencedColumnName: 'id' })
    emoticon!: Emoticon;
}

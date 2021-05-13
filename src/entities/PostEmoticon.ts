import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId} from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Post } from './Post';
import { Emoticon } from './Emoticon';


@ObjectType()
@Entity()
export class PostEmoticon {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('float', { precision: 8, scale: 2 })
    positionX!: number;

    @Field()
    @Column('float', { precision: 8, scale: 2 })
    positionY!: number;

    @Field()
    @Column('float', { precision: 8, scale: 2 })
    rotate!: number;

    // Post과 N:1
    @ManyToOne((type) => Post, (post) => post.usedEmoticons)
    @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
    post!: Post | null;

    @RelationId((postEmoticon: PostEmoticon) => postEmoticon.post)
    postId!: string;

    // Emoticon과 N:1
    @Field(() => Emoticon)
    @ManyToOne((type) => Emoticon, (emoticon) => emoticon.usedEmoticons)
    @JoinColumn({ name: 'emoticon_id', referencedColumnName: 'id' })
    emoticon!: Emoticon | null;
}

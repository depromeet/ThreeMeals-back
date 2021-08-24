import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Post } from './Post';
import { Emoticon } from './Emoticon';
import { EmoticonPosition } from './EmoticonPosition';
import { DomainEntity } from '../domain/common/DomainEntity';

@ObjectType()
@Entity('post_emoticon')
export class PostEmoticon extends DomainEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field(() => EmoticonPosition)
    @Column((type) => EmoticonPosition, { prefix: false })
    position!: EmoticonPosition;

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
    // @Field(() => Emoticon)
    @ManyToOne((type) => Emoticon, (emoticon) => emoticon.usedEmoticons)
    @JoinColumn({ name: 'emoticon_id', referencedColumnName: 'id' })
    emoticon!: Emoticon | null;

    @Field(() => String)
    fileUrl!: string | null;

    @Field(() => String)
    name!: string | null;
}

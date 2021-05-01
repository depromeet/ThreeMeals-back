import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { PostEmoticon } from './PostEmoticon';

@ObjectType()
@Entity()
export class Emoticon {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('varchar', { name: 'file_url' })
    fileUrl!: string;

    @Field()
    @Column('varchar')
    name!: string;

    // PostEmoticon과 1:N
    @OneToMany(() => PostEmoticon, (postemoticon) => postemoticon.emoticon)
    usedEmoticons!: PostEmoticon[];
}

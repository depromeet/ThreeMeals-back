import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { PostEmoticon } from './PostEmoticon';
import { DomainEntity } from '../common/DomainEntity';

@ObjectType()
@Entity('emoticon')
export class Emoticon extends DomainEntity {
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

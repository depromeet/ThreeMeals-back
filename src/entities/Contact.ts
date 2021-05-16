import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    RelationId,
} from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';
import { length } from 'class-validator';
import { Account } from './Account';


@ObjectType()
@Entity()
export class Contact {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('text')
    content!: string;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    // Post과 N:1
    @RelationId((contact: Contact) => contact.sender)
    senderId!: string;

    @Field(() => Account)
    @ManyToOne((type) => Account, (account) => account.writeContacts)
    @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
    sender!: Account | null;
}

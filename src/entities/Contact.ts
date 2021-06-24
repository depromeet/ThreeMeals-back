import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Account } from './Account';
import { DomainEntity } from '../common/DomainEntity';


@ObjectType()
@Entity('contact')
export class Contact extends DomainEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Field()
    @Column('text')
    content!: string;

    // Post과 N:1
    @RelationId((contact: Contact) => contact.sender)
    senderId!: string;

    @Field(() => Account)
    @ManyToOne((type) => Account, (account) => account.writeContacts)
    @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
    sender!: Account | null;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}

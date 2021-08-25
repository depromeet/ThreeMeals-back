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
import { AccountOrmEntity } from './AccountOrmEntity';
import { DomainEntity } from '../domain/common/DomainEntity';
import { AccountSchema } from '../presentation/resolvers/schemas/AccountSchema';


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

    @Field(() => AccountSchema)
    @ManyToOne((type) => AccountOrmEntity, (account) => account.writeContacts)
    @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
    sender!: AccountOrmEntity | null;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}

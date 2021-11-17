import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { AccountOrmEntity } from './AccountOrmEntity';

import { AccountSchema } from '../presentation/resolvers/schemas/AccountSchema';

@ObjectType()
@Entity()
export class Favorite extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    // @Field()
    // @Column({ name: 'favorite_from_account_id', type: 'bigint', unsigned: true })
    // account!: Account;

    // @Field()
    // @Column({ name: 'favorite_account_id', type: 'bigint', unsigned: true })
    // favoriteAccount!: Account;

    @Column({ name: 'account_id', type: 'bigint', unsigned: true })
    accountId!: string;

    @Field(() => AccountSchema)
    @ManyToOne((type) => AccountOrmEntity, (account) => account.favorites)
    @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
    account!: AccountOrmEntity | null;

    @Column({ name: 'favorite_account_id', type: 'bigint', unsigned: true })
    favoriteAccountId!: string;

    @Field(() => AccountSchema, { nullable: true })
    @ManyToOne(() => AccountOrmEntity)
    @JoinColumn({ name: 'favorite_account_id', referencedColumnName: 'id' })
    favoriteAccount!: AccountOrmEntity | null;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}

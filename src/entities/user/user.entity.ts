import { defaultEntity } from '../base/baseEntity';
import { Container } from 'typedi';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends defaultEntity {
  @Field()
  @Column('text')
  email!: string;

  @Field({ nullable: true })
  @Column('text')
  username!: string;

  //   @Field({ nullable: true })
  //   @Column('text', { nullable: true })
  //   firstName?: string;

  //   @Field({ nullable: true })
  //   @Column('text', { nullable: true })
  //   lastName?: string;

  //   @Field(() => Int, { nullable: true })
  //   @Column('int', { nullable: true })
  //   age?: number;
}
// Container.set('user', User);

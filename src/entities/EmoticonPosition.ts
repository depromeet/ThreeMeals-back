import { Column } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class EmoticonPosition {
    @Field()
    @Column( { name: 'position_x', type: 'float', precision: 8, scale: 2 })
    positionX!: number;

    @Field()
    @Column({ name: 'position_y', type: 'float', precision: 8, scale: 2 })
    positionY!: number;
}

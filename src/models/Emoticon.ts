/* eslint-disable camelcase */
import {Field, ObjectType} from 'type-graphql';
import {Model} from 'sequelize';

export interface EmoticonAttributes {
    id: number;
    file_url: string;
    name: string;
}

@ObjectType()
export default class Emoticon extends Model implements EmoticonAttributes {
    @Field()
    public id!: number;

    @Field()
    public file_url!: string;

    @Field()
    public name!: string;
}


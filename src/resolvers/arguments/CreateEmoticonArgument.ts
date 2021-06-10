import { ArgsType, Field, InputType } from 'type-graphql';
import { PostEmoticon } from '../../entities/PostEmoticon';
import { Builder } from 'builder-pattern';
import { Emoticon } from '../../entities/Emoticon';
import { IsString } from 'class-validator';
import { EmoticonPosition } from '../../entities/EmoticonPosition';

@ArgsType()
@InputType('position')
class PositionArgument {
    @Field({ nullable: true, defaultValue: 0 })
    positionX?: number;

    @Field({ nullable: true, defaultValue: 0 })
    positionY?: number;
}


@ArgsType()
@InputType('emoticons')
export class CreateEmoticonArgument {
    @Field()
    @IsString({
        message: 'invalid emoticonId',
    })
    emoticonId!: string;

    @Field(() => PositionArgument)
    position!: PositionArgument;

    @Field({ nullable: true, defaultValue: 0 })
    rotate?: number;

    toPostEmoticon(): PostEmoticon {
        return Builder(PostEmoticon)
            .position(Builder(EmoticonPosition)
                .positionX(this.position.positionX || 0)
                .positionY(this.position.positionY || 0)
                .build())
            // .positionX(this.positionX || 0)
            // .positionY(this.positionY || 0)
            .rotate(this.rotate || 0)
            .emoticon(Builder(Emoticon).id(this.emoticonId).build())
            .build();
    }
}

import { IsEnum, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { Provider } from '../../types/Enums';

@ArgsType()
export class SignInArgument {
    @IsString({
        message: 'authData cannot be found or invalid type',
    })
    @Field()
    accessToken!: string;

    @IsEnum(Provider, {
        message: 'invalid provider parameter',
    })
    @Field((type) => String)
    provider!: Provider;
}

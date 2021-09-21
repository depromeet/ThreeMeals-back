import { Resolver, Query } from 'type-graphql';
import { Service } from 'typedi';
import { Emoticon } from '../../entities/Emoticon';
import { EmoticonService } from '../../application/services/EmoticonService';

@Service()
@Resolver(() => Emoticon)
export class EmoticonResolver {
    constructor(private readonly emoticonService: EmoticonService) {}

    @Query((returns) => [Emoticon])
    async getAllEmoticons(
    ): Promise<Emoticon[]> {
        const emoticons = await this.emoticonService.getAllEmoticons();
        return emoticons;
    }
}

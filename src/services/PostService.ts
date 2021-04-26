import { Inject, Service } from 'typedi';
import { Post } from '../entities/Post';
import { PostRepository } from '../repositories/PostRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PostType, PostState, SecretType } from '../entities/Enums';
import { InsertPostArgument, UpdatePostArgument } from '../resolvers/arguments/PostArgument';
import { logger } from 'src/logger/winston';

@Service()
export class PostService {
    constructor(@InjectRepository() private readonly PostRepository: PostRepository) {}
    async makePost(args: {
        content: string,
        postType: PostType,
        color: string,
        postState: PostState,
        secretType: SecretType
    }): Promise<Post> {
        // fromAccountId 리졸버에서 넣어줘야 하는데 더 고민 필요
        // const fromAccountId = uuid().toString();
        // const toAccountId = uuid().toString();

        const { content, postType, postState, color, secretType } = args;
        const newPost = new Post();

        newPost.content = content;
        newPost.postType = postType;
        newPost.color = color;
        newPost.postState = postState;
        newPost.secretType = secretType;
        console.log(newPost);
        await this.PostRepository.createPost(newPost);

        // const newPost = await this.PostRepository.create({ content: content, postType: postType,
        //     color: color, state: state, secretType: secretType });

        return newPost;
    }

    // async updatePost(args: {
    //     id: number,
    //     // content?: string,
    //     // color?: Color,
    //     // secretType?: string
    //     updatePostArgument: UpdatePostArgument
    // }): Promise<Post> {
    //     const { id, updatePostArgument } = args;
    //     const post = this.PostRepository.findOne({ where: { id } });
    //     const newPost = await this.PostRepository.create({ ...post, ...updatePostArgument });

    //     console.log(newPost);
    //     return this.PostRepository.save(newPost);
    // }

    async updatePost(args: {
        id: number,
        content: string,
        color: string,
        secretType: SecretType
    }): Promise<Post> {
        const { id, content, color, secretType } = args;
        const updatepost = this.PostRepository.create({ id: id });
        updatepost.content = content;
        updatepost.color = color;
        updatepost.secretType = secretType;
        const updated = await this.PostRepository.save(updatepost);
        console.log(updated);
        return updated;
    }


    async deletePost(args: { id: number }): Promise<void> {
        const { id: id } = args;
        const deletePost = this.PostRepository.findOne({ id: id });
        if (!deletePost) {
            // logger.info('no post');
            throw new Error('Post not found!');
        }

        await this.PostRepository.delete({ id: id });
    }
}

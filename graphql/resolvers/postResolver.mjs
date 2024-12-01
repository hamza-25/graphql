import Post from '../../models/Post.mjs';
import { userAuth } from '../../utils/userAuthVerify.mjs';

const postResolver = {
    Query: {

    },
    Mutation: {
        postsCreate: ( async ({input}) => {
            const userId = userAuth(input.token);
            const post = new Post({
                title: input.title,
                content: input.content,
                userId
            });
            await post.save();
            return post;
        }),
    }
}

export default postResolver;
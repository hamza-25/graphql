import userResolver from './resolvers/userResolver.mjs';
import postResolver from './resolvers/postResolver.mjs';

const resolvers = {
    Query: {
        ...userResolver.Query,
        ...postResolver.Query,
    },
    Mutation: {
        ...userResolver.Mutation,
        ...postResolver.Mutation,
    }
}

export default resolvers;
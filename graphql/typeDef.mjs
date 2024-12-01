import userType from './schema/userSchema.mjs';
import postType from './schema/postSchema.mjs';

const typeDef = `
    type Query
    type Mutation
    ${userType}
    ${postType}
`;

export default typeDef;
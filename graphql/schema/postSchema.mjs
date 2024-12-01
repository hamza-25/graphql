const postType = `
    type Post {
        id: ID
        title: String!
        content: String!
        userId: String!
    }
    input inputPost {
        title: String!
        content: String!
        token:String!
    }
    extend type Mutation {
        postsCreate(input: inputPost): Post
    }
`;

export default postType;
const userType = `
    type User {
        id: String
        name: String!
        email: String!
    }
    extend type Query {
        hello: String
        usersGet: [User!]!
    }

    extend type Mutation {
        userCreate(name:String!, email:String!, password:String!): User
        userLogin(email:String!, password:String!): String
    }
`;

export default userType;
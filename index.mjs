import express  from 'express';
import {buildSchema}  from 'graphql';
import {createHandler}  from 'graphql-http/lib/use/express';
import { ruruHTML }  from 'ruru/server';
import User from './models/User.mjs';
import Post from './models/Post.mjs';
import bcrypt from 'bcrypt';
import('./connections/connection.mjs');
import ('dotenv/config');
import jwt from 'jsonwebtoken';
import typeDef from './graphql/typeDef.mjs';
import { userAuth } from './utils/userAuthVerify.mjs';

const app = express()
const port = 3000


const schema = buildSchema(typeDef);
// const schema = buildSchema(`
//     type Post {
//         id: ID
//         title: String!
//         content: String!
//         userId: String!
//     }
//     input inputPost {
//         title: String!
//         content: String!
//         token:String!
//     }
//     type User {
//         id: String
//         name: String!
//         email: String!
//     }
//     type Query {
//         hello: String
//         usersGet: [User!]!
//     }

//     type Mutation {
//         userCreate(name:String!, email:String!, password:String!): User
//         userLogin(email:String!, password:String!): String
//         postsCreate(input: inputPost): Post
//     }
// `);

const queriesOpr = {
    hello: () => 'hello world',
    usersGet: async () => {
        const users = await User.find();
        return users;
    }, 
};

const mutationOpr = {
    userCreate: (async ({name, email, password}) => {
        const userExists = await User.findOne({email});
        if(userExists)
            throw new Error(`user exists`);
        if(password.length === 0)
            throw new Error(`password can't be empty`);
        const hashPassword = await bcrypt.hash(password, 10);
        const userData = {name, email, password: hashPassword};
        const user = new User(userData);
        await user.save();
        return{
            name,
            email,
        }
    }),
    userLogin: (async ({email, password}) => {
        const userexists = await User.findOne({email});
        const validPass = await bcrypt.compare(password, userexists.password);
        if (!userexists || !validPass)
            throw new Error(`invalid credentials`);
        const token = jwt.sign({userId: userexists._id}, process.env.SECRET, {expiresIn: '24h'});
        return token;
    }),
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
};

const root = {
    ...queriesOpr,
    ...mutationOpr,

};

app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
  })

app.all('/graphql', createHandler({schema, rootValue: root}));

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
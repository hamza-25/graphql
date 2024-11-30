import express  from 'express';
import {buildSchema}  from 'graphql';
import {createHandler}  from 'graphql-http/lib/use/express';
import { ruruHTML }  from 'ruru/server';
import User from './models/User.mjs';
import Post from './models/Post.mjs';
import bcrypt from 'bcrypt';
import('./connections/connection.mjs');

const app = express()
const port = 3000

const schema = buildSchema(`
    type User {
        id: String,
        name: String!,
        email: String!,
    }
    type Query {
        hello: String,
    }

    type Mutation {
        userCreate(name:String!, email:String!, password:String!): User
    }
`);

const queriesOpr = {
    hello: () => 'hello world',
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
};

const root = {
    ...queriesOpr,
    ...mutationOpr,

};

app.get("/graphql", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
  })

app.all('/graphql', createHandler({schema, rootValue: root}));

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
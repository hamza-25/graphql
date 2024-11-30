const express = require('express')
const {buildSchema} = require('graphql');
const {createHandler} = require('graphql-http/lib/use/express');
const { ruruHTML } = require("ruru/server");

const app = express()
const port = 3000

const users = [
    {id: '1', name: 'hamza'},
    {id: '2', name: 'sana'}
]

const schema = buildSchema(`
    type User {
        id: String,
        name: String,
    }
    type Query {
        hello: String,
        users: [User],
        user(id:String): User
    }

    type Mutation {
        createUser(id:String, name:String): User
    }
`);

const queriesOpr = {
    hello: () => 'hello world',
    users: () => users,
    user: ((args) => users.find(user => user.id == args.id)),
};

const mutationOpr = {
    createUser: (({id, name}) => {
        const createUser = {id, name};
        users.push(createUser);
        return createUser;
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
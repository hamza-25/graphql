import express  from 'express';
import {buildSchema}  from 'graphql';
import {createHandler}  from 'graphql-http/lib/use/express';
import { ruruHTML }  from 'ruru/server';
import typeDef from './graphql/typeDef.mjs';
import resolvers from './graphql/resolvers.mjs';

import('./connections/connection.mjs');
import ('dotenv/config');

const app = express()
const port = 3000


const schema = buildSchema(typeDef);

const root = {
    ...resolvers.Query,
    ...resolvers.Mutation,

};

app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
  })

app.all('/graphql', createHandler({schema, rootValue: root}));

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
const express = require("express");
const {ApolloServer, gql} = require('apollo-server-express');
const cors = require('cors');
require("dotenv").config({ path: "variables.env" });
const DBconnection = require("./config/db");
const { readFileSync } = require("fs");


const app = express();

app.use(express.json({ extended: true }), cors());


const resolvers = require("./graphql/resolvers");
const typeDefs = gql(readFileSync('./graphql/schema.graphql', {encoding: 'utf-8'}));
const apolloServer = new ApolloServer({typeDefs, resolvers});
apolloServer.applyMiddleware({app, path: '/graphql'});



// Conectar a la base de datos
DBconnection();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

const express = require("express");
const graphqlHttp = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
require("dotenv").config({ path: "variables.env" });
const DBconnection = require("./config/db");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/schema");
// const { readFileSync } = require("fs");
// const { join } = require("path");

const app = express();

app.use(express.json({ extended: true }));

// prevenir errores de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept,X-Requested-With"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// leer el esquema de graphql
// const typeDefs = readFileSync(
//   join(__dirname, "graphql", "schema.graphql"),
//   "utf-8"
// );
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });

app.use(
  "/graphql",
  graphqlHttp({
    schema: executableSchema,
    //rootValue: resolvers,
    graphiql: true,
    customFormatErrorFn(err) {
      console.log(err.originalError);
      if (!err.originalError) {
        console.log(err);
        return err;
      }
      const data = err.originalError.data; // creado en el resolver
      const message = err.message || "An error ocurred!"; // pull out by default by graphql
      const code = err.originalError.code || 500;
      console.log("data: ", data, " message: ", message, " status: ", code);
      return { message: message, statusCode: code, data: data };
    }
  })
);

// Conectar a la base de datos
DBconnection();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const grapQlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  grapQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

//DB config
const db = "mongodb://localhost:27017/graphqltest";
mongoose
  .connect(db)
  .then(() => {
    console.log("mongo connected");
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

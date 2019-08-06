const express = require("express");
const bodyParser = require("body-parser");
const grapQlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/Event");

const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
  "/graphql",
  grapQlHttp({
    schema: buildSchema(`
    type Event{
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    input EventInput{
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    type RootQuery {
        events: [Event!]!
    }
    type RootMutation {
        createEvent(eventInput:EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              return { ...event._doc };
            });
          })
          .catch(err => {
            console.log(err);
          });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        return event
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }
    },
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

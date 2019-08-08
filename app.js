const express = require("express");
const bodyParser = require("body-parser");
const grapQlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/Event");
const User = require("./models/User");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  grapQlHttp({
    schema: buildSchema(`

    type User{
      _id: ID!
      email: String!
      password: String
    }

    type Event{
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email : String!
      password :String!
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
        creatUser(userInput:UserInput): User
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
      },
      creatUser: args => {
        return bcrypt
          .hash(args.userInput.password, 12)
          .then(hashedPswd => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPswd
            });

            return user
              .save()
              .then(result => {
                //  console.log(result);
                return { ...result._doc };
              })
              .catch(err => console.log(err));
          })

          .catch(err => console.log(err));
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

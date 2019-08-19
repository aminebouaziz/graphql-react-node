const Event = require("../../models/Event");

const { dateToString } = require("../../helpers/date");
const { user } = require("./merge");

module.exports = {
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            date: dateToString(event._doc.date),
            creator: user.bind(this, event._doc.creator)
          };
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
      date: dateToString(args.eventInput.date),
      creator: "5d551b933070d02bfcc298f3"
    });
    let createdEvent;
    return event
      .save()
      .then(result => {
        createdEvent = {
          ...result._doc,
          date: dateToString(event._doc.date),
          creator: user.bind(this, result._doc.creator)
        };
        return User.findById("5d551b933070d02bfcc298f3");
      })
      .then(user => {
        if (!user) {
          throw new Error("user not find");
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then(result => {
        console.log(result);
        return createdEvent;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
};

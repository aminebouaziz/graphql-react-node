const bcrypt = require("bcryptjs");

const Event = require("../../models/Event");
const User = require("../../models/User");

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator)
        };
      });
    })
    .catch(err => console.log(err));
};
const user = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    })
    .catch(err => console.log(err));
};

module.exports = {
  events: () => {
    return Event.find()

      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
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
      date: new Date(args.eventInput.date),
      creator: "5d4c43275a85ab33946bd068"
    });
    let createdEvent;
    return event
      .save()
      .then(result => {
        createdEvent = {
          ...result._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator)
        };
        return User.findById("5d4c43275a85ab33946bd068");
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
  },
  creatUser: args => {
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          throw new Error("User already exist");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then(hashedPswd => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPswd
        });

        return user
          .save()
          .then(result => {
            //  console.log(result);
            return { ...result._doc, password: null };
          })
          .catch(err => console.log(err));
      })

      .catch(err => console.log(err));
  }
};

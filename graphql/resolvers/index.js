const bcrypt = require("bcryptjs");

const Event = require("../../models/Event");
const User = require("../../models/User");
const Booking = require("../../models/Booking");

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

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return { ...event._doc, creator: user.bind(this, event.creator) };
  } catch (err) {
    throw err;
  }
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
  bookings: () => {
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          return {
            ...booking._doc,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString()
          };
        });
      })
      .catch(err => console.log(err));
  },
  createEvent: args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5d551b933070d02bfcc298f3"
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
  },
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    console.log(fetchedEvent);
    const booking = new Booking({
      user: "5d551b933070d02bfcc298f3",
      event: fetchedEvent
    });
    return booking
      .save()
      .then(result => {
        return {
          ...result._doc,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(result._doc.createdAt).toISOString(),
          updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
      })
      .catch(err => console.log(err));
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      console.log(booking);
      const event = {
        ...booking.event._doc,
        creator: user.bind(this, booking.event._doc.creator)
      };
      console.log(event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};

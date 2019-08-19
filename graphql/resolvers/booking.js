const Booking = require("../../models/Booking");
const Event = require("../../models/Event");

const { dateToString } = require("../../helpers/date");
const { user, singleEvent } = require("./merge");

module.exports = {
  bookings: () => {
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          return {
            ...booking._doc,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: dateToString(booking._doc.createdAt),
            updatedAt: dateToString(booking._doc.updatedAt)
          };
        });
      })
      .catch(err => console.log(err));
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
          createdAt: dateToString(result._doc.createdAt),
          updatedAt: dateToString(result._doc.updatedAt)
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

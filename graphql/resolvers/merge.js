const Event = require("../../models/Event");
const User = require("../../models/User");

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          date: dateToString(event._doc.date),
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

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;

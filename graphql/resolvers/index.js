const authResolver = require("./auth");
const eventsResolver = require("./event");
const bookingResolver = require("./booking");

const rootResolver = {
  ...authResolver,
  ...bookingResolver,
  ...eventsResolver
};
module.exports = rootResolver;

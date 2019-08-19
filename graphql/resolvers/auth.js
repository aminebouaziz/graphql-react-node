const bcrypt = require("bcryptjs");

const User = require("../../models/User");

module.exports = {
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

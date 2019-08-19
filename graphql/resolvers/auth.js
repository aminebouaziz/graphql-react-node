const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("user does not exist !");
    }
    const isEsqual = await bcrypt.compare(password, user.password);

    if (!isEsqual) {
      throw new Error("password is incorrect  !");
    }
    const token = jwt.sign(
      { userId: user.id, eamil: user.email },
      "secretkey",
      { expiresIn: "1h" }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};

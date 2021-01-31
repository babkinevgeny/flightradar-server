const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../user');

const registerController = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, async (err, doc) => {
    if (err) {
      throw err;
    }

    if (doc) {
      res.send(`User ${req.body.username} already exists`);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        password: hashedPassword,
      });

      await newUser.save();
      res.send(`User ${req.body.username} was created`);
    }
  });
}

const loginController = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      throw err;
    }

    if (!user) {
      res.send('Wrong data. Change username or password');
    } else {
      req.logIn(user, (err) => {
        if (err) {
          throw err;
        }

        res.send('Authentication succeed');
        console.log(req.user);
      })
    }
  })(req, res, next);
};

const currentUserController = (req, res) => {
  res.send(req.user);
};

module.exports = {
  registerController,
  loginController,
  currentUserController
};
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../user');

const registerController = async (req, res) => {
  const { username, password } = req.body;
  const userFound = await User.findOne({ username }, (err, doc) => {
    if (err) {
      throw err;
    }

    return doc;
  });

  if (userFound) {
    res.send(`User ${username} already exists`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save((err) => {
      if (err) {
        throw err;
      }

      req.logIn(newUser, (err) => {
        if (err) {
          throw err;
        }

        res.send(newUser);
      });
    });
  }
};

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

        res.send(user);
      })
    }
  })(req, res, next);
};

const currentUserController = async (req, res) => {
  console.log(req.user);
  const { username } = req.user;
  const user = await getUser(username);
  res.send(user);
};

const saveFavorites = (req, res) => {
  const { id, username, favorites } = req.body;

  User.findOneAndUpdate(
    { username: username },
    { $set: { favorites } },
    async (err, doc) => {
      if (err) {
        throw err;
      }
      if (doc) {
        console.log(`Favorites of ${username} were successfully updated`);
        res.send('Success');
      }
    });
};


module.exports = {
  registerController,
  loginController,
  currentUserController,
  saveFavorites,
};
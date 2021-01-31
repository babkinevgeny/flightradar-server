const User = require('./user');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
    passport.use(
        new localStrategy((username, password, done) => {
            User.findOne({ username }, (err, user) => {
                if (err) throw err;
                if ( !user ) return done(null, false);
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) throw err;

                    return result ? done(null, user) : done(null, false);
                })
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ _id: id }, (err, user) => {
            const userInfo = {
                username: user.username,
                id: user._id
            };

            done(err, userInfo);
        })
    });
}
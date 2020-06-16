const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();
import User from '../models/User';

export default () => {
  // Local Strategy
  passport.use(
    new LocalStrategy(function (username, password, done) {
      // 저장되어 있는 User와 비교
      User.findOne({ username, password })
        .then((user) => {
          if (!user) {
            return done(null, false, {});
          }
          return done(null, user, { message: 'Logged In Successfully' });
        })
        .catch((err) => done(err));
    }),
  );

  // JWT Strategy
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      (jwtPayload, done) => {
        return User.findById(jwtPayload._id)
          .then((user) => {
            done(null, user);
          })
          .catch((err) => done(err));
      },
    ),
  );
};

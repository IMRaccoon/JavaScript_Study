import { Strategy, ExtractJwt } from 'passport-jwt';
import mongoose from 'mongoose';
import { secretOrKey } from './keys';

const User = mongoose.model('users');

const opts = {
  secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export default (passport) => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      User.findById(payload.id)
        .then((user) => {
          if (!!user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((error) => console.log(error));
    }),
  );
};

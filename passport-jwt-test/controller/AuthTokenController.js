import jwt from 'jsonwebtoken';
import passport from 'passport';

require('dotenv').config();
export const create = function (req, res) {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // jwt.sign('token내용', 'JWT secretkey')
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res);
};

export const checkValid = function (req, res) {
  console.log(req);
  res.json({ user: req.user });
};

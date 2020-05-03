import express from 'express';
import User from '../../models/User';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import keys from '../../config/keys';
import passport from 'passport';

const router = express();

router.get('/', (req, res) => {
  res.send('passport module test');
});

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  User.findOne({ email }).then((user) => {
    if (!!user) {
      return res.status(400).json({
        email: '해당 이메일을 가진 사용자가 존재합니다.',
      });
    }
    const newUser = new User({
      email,
      password,
      name,
    });
    argon2.hash(newUser.password).then((hash) => {
      newUser.password = hash;
      newUser
        .save()
        .then((user) => res.json(user))
        .catch((error) => console.log(error));
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res
        .status(400)
        .json({ email: '해당하는 회원이 존재하지 않습니다.' });
    }
    argon2.verify(user.password, password).then((isMatch) => {
      if (isMatch) {
        const payload = { id: user._id, name: user.name };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (error, token) => {
            return res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          },
        );
      } else {
        return res
          .status(400)
          .json({ password: '비밀번호가 일치하지 않습니다.' });
      }
    });
  });
});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  },
);

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  User.deleteOne({ _id: id })
    .then(() => res.json({ success: true }))
    .catch((err) =>
      res.status(400).json({
        success: false,
      }),
    );
});

export default router;

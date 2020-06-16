import express from 'express';
import * as AuthTokenController from '../controller/AuthTokenController';
import User from '../models/User';
import passport from 'passport';
passport.initialize();
const router = express();

router.get('/', (req, res) => {
  return res.render('index.html');
});

router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  },
);

router.post('/login', (req, res) => {
  console.log(req.body);
  return res.sendStatus(200);
});

router.post('/auth/tokens', AuthTokenController.create);

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  return User.create({ username, password }).then((_) => res.sendStatus(200));
});

router.get('/logout', (req, res) => {
  return res.sendStatus(200);
});

router.delete('/:userID', (req, res) => {
  return res.sendStatus(200);
});

export default router;

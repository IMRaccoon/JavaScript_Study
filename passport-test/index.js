import express from 'express';
import mongoose from 'mongoose';
import users from './route/api/users';
import { mongoURI } from './config/keys';
import passport from 'passport';
import passportfun from './config/passport';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Mongo DB is connected'))
  .catch((err) => console.log(err));

passportfun(passport);

app.use('/api/users', users);

app.listen(5000, () => {
  console.log('5000 port is listening..');
});

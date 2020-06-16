import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import passportConfig from './config/passport';
import route from './route';

const app = express();
const port = 3002;

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('jwt-secret', process.env.JWT_SECRET);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(passport.initialize());
passportConfig();
app.use('/', route);

app.listen(port, () => console.log(port + ' is listening'));

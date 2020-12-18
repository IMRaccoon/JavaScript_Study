import * as express from 'express';
import * as dotenv from 'dotenv';
import { dbConfig } from './models';
import router from './routes';

dotenv.config();

const app = express();
const db = dbConfig();

db.authenticate()
  .then((_) => {
    console.log('Connection Success');
  })
  .catch((_) => {
    console.log('Connection Failed');
  });

// db.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', router);

app.listen(3000, () => {
  console.log('post 3000 is listening');
});

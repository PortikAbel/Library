import express from 'express';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import eformidable from 'express-formidable';
import cookieParser from 'cookie-parser';

import connectDb from './db/mongo.js';

import bookApi from './api/books.js';
import rootRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import registerRouter from './routes/register.js';

import checkLogin from './middleware/checkLogin.js';
import checkUser from './middleware/checkUser.js';

const app = express();

// upload directory of book cover pictures
const bookDir = path.join(process.cwd(), 'books');
if (!existsSync(bookDir)) {
  mkdirSync(bookDir);
}
app.use('/books', eformidable({ bookDir }));

// static files
app.use(express.static(path.join(process.cwd(), 'static')));
app.use(express.static(path.join(bookDir)));

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(cookieParser());
app.use(express.json());

app.use(checkLogin);

app.use('/', authRouter);
app.use('/', rootRouter);

app.use(checkUser);

app.use('/users', userRouter);
app.use('/books', bookApi);
app.use('/register', registerRouter);

connectDb();

app.listen(5000, () => { console.log('Server listening on http://localhost:5000/ ...'); });

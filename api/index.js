import express from 'express';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import eformidable from 'express-formidable';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import connectDb from './db/mongo.js';

import imageRouter from './routes/images.js';
import bookGeneralApi from './routes/booksGeneral.js';
import userUpdateRouter from './routes/userUpdate.js';
import rentApi from './routes/rents.js';
import authRouter from './routes/auth.js';
import bookAdminApi from './routes/booksAdmin.js';
import userRouter from './routes/users.js';

import checkLogin from './middleware/checkLogin.js';
import checkUser from './middleware/checkUser.js';
import checkAdmin from './middleware/checkAdmin.js';

// upload directory of book cover pictures
const imageDir = path.join(process.cwd(), 'images');
if (!existsSync(imageDir)) {
  mkdirSync(imageDir);
}

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('tiny'));

// file uploading / serving
app.use('/images', eformidable({ imageDir }));
app.use('/images', imageRouter);
app.use(express.static(path.join(imageDir)));

// pre processing
app.use(cookieParser());
app.use(express.json());

// guests
app.use('/books', bookGeneralApi);

// parse token cookie
app.use(checkLogin);

// authentication
app.use('/auth', authRouter);

// users
app.use(checkUser);

app.use('/users', userUpdateRouter);
app.use('/rents', rentApi);

// admins
app.use(checkAdmin);

app.use('/books', bookAdminApi);
app.use('/users', userRouter);

connectDb();

app.listen(5000, () => { console.log('Server listening on http://localhost:5000/ ...'); });

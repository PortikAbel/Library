import express from 'express';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import eformidable from 'express-formidable';
import rootRequests from './routes/index.js';
import userRequests from './routes/users.js';
import bookRequests from './routes/books.js';
import connectDb from './db/mongo.js';

const app = express();

// upload directory of book cover pictures
const bookDir = path.join(process.cwd(), 'books');
if (!existsSync(bookDir)) {
  mkdirSync(bookDir);
}
app.use(eformidable({ bookDir }));

// static files
app.use(express.static(path.join(process.cwd(), 'static')));
app.use(express.static(path.join(process.cwd(), 'books')));

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use('/', rootRequests);
app.use('/users', userRequests);
app.use('/books', bookRequests);
connectDb();

app.listen(5000, () => { console.log('Server listening on http://localhost:5000/ ...'); });

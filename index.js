import express from 'express';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import eformidable from 'express-formidable';
import books from './routes/books.js';

const staticDir = path.join(process.cwd(), 'static');
const bookDir = path.join(process.cwd(), 'books');

const app = express();

if (!existsSync(bookDir)) {
  mkdirSync(bookDir);
}

app.use(express.static(staticDir));

app.use(eformidable({ bookDir }));

app.use('/books', books);

app.listen(5000);

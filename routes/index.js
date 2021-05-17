import { Router } from 'express';
import * as db from '../db/mongo.js';
import bookRouter, { displayBooks, getBooksAndUsers } from './books.js';
import userRouter from './users.js';

const router = Router();

router.use('/books', bookRouter);
router.use('/users', userRouter);

router.get('/', displayBooks);

router.get('/book-rents', (req, res) => {
  const isbn = parseInt(req.query.isbn, 10);
  db.findRentsOf(isbn)
    .then((result) => res.render('book_rents', { isbn, rents: result }))
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.get('/register', (_req, res) => {
  res.render('register_form');
});

router.get('/rent', (_req, res) => {
  getBooksAndUsers()
    .then((result) => {
      res.render('rent_form', result);
    })
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.get('/return', (_req, res) => {
  getBooksAndUsers()
    .then((result) => {
      res.render('return_form', result);
    })
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.get('/sign-in', (_req, res) => {
  res.render('sign_in');
});

router.get('/sign-out', (_req, res) => {
  db.findUsers()
    .then((result) => {
      res.render('sign_out', { users: result });
    });
});

export default router;

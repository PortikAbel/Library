import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import * as db from '../db/mongo.js';
import { registerSceme, rentScheme } from '../scemes/libraryScemes.js';

const router = Router();

router.post('/register', (req, res) => {
  const coverImgHandler = req.files.cover;
  fs.promises.rename(
    coverImgHandler.path,
    path.join(process.cwd(), 'books', coverImgHandler.name),
  )
    .then(() => {
      const newBook = {
        _id: parseInt(req.fields.isbn, 10),
        title: req.fields.title,
        author: req.fields.author,
        releasedate: req.fields.releasedate,
        summary: req.fields.summary,
        copies: parseInt(req.fields.copies, 10),
        imageName: coverImgHandler.name,
      };
      const { error } = registerSceme.validate(newBook);
      if (error != null) {
        throw new Error(error);
      }
      return newBook;
    })
    .then((newBook) => db.insertBook(newBook))
    .then(() => { res.redirect('/'); })
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.post('/rent', (req, res) => {
  const rent = {
    renter: req.fields.username,
    isbn: parseInt(req.fields.isbn, 10),
  };

  const { error } = rentScheme.validate(rent);
  if (error != null) {
    res.status(400).send(error);
    return;
  }

  db.rentBook(rent)
    .then(() => db.getBooksAndUsers())
    .then((result) => {
      res.render('rent_form', {
        books: result.books,
        users: result.users,
        success: {
          username: req.fields.username,
          isbn: req.fields.isbn,
        },
      });
    })
    .catch((err) => {
      db.getBooksAndUsers()
        .then((result) => {
          res.render('rent_form', {
            books: result.books,
            users: result.users,
            error: err.message,
          });
        });
    });
});

router.post('/return', (req, res) => {
  const rent = {
    renter: req.fields.username,
    isbn: parseInt(req.fields.isbn, 10),
  };

  const { error } = rentScheme.validate(rent);
  if (error != null) {
    res.status(400).send(error);
    return;
  }

  db.returnBook(rent)
    .then(() => db.getBooksAndUsers())
    .then((result) => {
      res.render('return_form', {
        books: result.books,
        users: result.users,
        success: {
          username: req.fields.username,
          isbn: req.fields.isbn,
        },
      });
    })
    .catch((err) => {
      db.getBooksAndUsers()
        .then((result) => {
          res.render('return_form', {
            books: result.books,
            users: result.users,
            error: err.message,
          });
        });
    });
});

export default router;

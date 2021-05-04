import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import {
  deleteUser,
  findBooks, findRentsOf, findUsers, insertBook, insertUser, rentBook, returnBook,
} from '../db/mongo.js';
import { registerSceme, rentScheme } from '../scemes/libraryScemes.js';

const router = Router();

function displayBooks(req, res) {
  findBooks()
    .then((result) => res.render('book_table', { books: result }))
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
}

function getBooksAndUsers() {
  let books;
  let users;
  return findBooks()
    .then((result) => {
      books = result;
      return findUsers();
    })
    .then((result) => {
      users = result;
      return { books, users };
    });
}

router.get('/', displayBooks);

router.get('/book-rents', (req, res) => {
  const isbn = parseInt(req.query.isbn, 10);
  findRentsOf(isbn)
    .then((result) => res.render('book_rents', { isbn, rents: result }))
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.get('/register', (req, res) => {
  res.render('register_form');
});

router.get('/rent', (req, res) => {
  getBooksAndUsers()
    .then((result) => {
      res.render('rent_form', result);
    })
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.get('/return', (req, res) => {
  getBooksAndUsers()
    .then((result) => {
      res.render('return_form', result);
    })
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.get('/sign-in', (req, res) => {
  res.render('sign_in');
});

router.get('/sign-out', (req, res) => {
  findUsers()
    .then((result) => {
      res.render('sign_out', { users: result });
    });
});

router.post('/books/register', (req, res) => {
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
    .then((newBook) => insertBook(newBook))
    .then(() => { displayBooks(req, res); })
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.post('/books/rent', (req, res) => {
  const rent = {
    renter: req.fields.username,
    isbn: parseInt(req.fields.isbn, 10),
  };

  const { error } = rentScheme.validate(rent);
  if (error != null) {
    res.status(400).send(error);
    return;
  }

  rentBook(rent)
    .then(() =>  getBooksAndUsers())
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
      getBooksAndUsers()
        .then((result) => {
          res.render('rent_form', {
            books: result.books,
            users: result.users,
            error: err.message,
          });
        });
    });
});

router.post('/books/return', (req, res) => {
  const rent = {
    renter: req.fields.username,
    isbn: parseInt(req.fields.isbn, 10),
  };

  const { error } = rentScheme.validate(rent);
  if (error != null) {
    res.status(400).send(error);
    return;
  }

  returnBook(rent)
    .then(() => getBooksAndUsers())
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
      getBooksAndUsers()
        .then((result) => {
          res.render('return_form', {
            books: result.books,
            users: result.users,
            error: err.message,
          });
        });
    });
});

router.post('/users/sign-in', (req, res) => {
  const { username } = req.fields;
  insertUser(username)
    .then(() => res.render('sign_in', { success: { username } }))
    .catch((err) => res.render('sign_in', { error: err.message }));
});

router.post('/users/sign-out', (req, res) => {
  const { username } = req.fields;

  deleteUser(username)
    .then(() => findUsers())
    .then((result) => {
      res.render('sign_out', { users: result, success: { username } });
    })
    .catch((err) => {
      findUsers()
        .then((result) => res.render('sign_out', { users: result, error: err.message }));
    });
});

export default router;

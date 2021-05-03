import { Router } from 'express';
import mongo from 'mongodb';
import path from 'path';
import fs from 'fs';
import { registerSceme, rentScheme } from '../scemes/libraryScemes.js';

const url = 'mongodb://localhost:27017/';
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const dbo = mongo.MongoClient(url, options);
let library;

const router = Router();

function displayBooks(req, res) {
  library.collection('books').find().toArray()
    .then((result) => res.render('book_table', { books: result }))
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
}

function getBooksAndUsers() {
  let bookIDs;
  let userNames;
  return library.collection('books')
    .find().project({ _id: 1 }).toArray()
    .then((result) => {
      bookIDs = result.map(Object.values);
      return library.collection('users')
        .find().project({ _id: 1 }).toArray();
    })
    .then((result) => {
      userNames = result.map(Object.values);
      return { books: bookIDs, users: userNames  };
    });
}

router.get('/', displayBooks);

router.get('/book-rents', (req, res) => {
  const query = { isbn: parseInt(req.query.isbn, 10) };
  library.collection('rents').find(query).toArray()
    .then((result) => res.render('book_rents', { isbn: query.isbn, rents: result }))
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

router.post('/books/register', (req, res) => {
  const coverImgHandler = req.files.cover;
  fs.promises.rename(
    coverImgHandler.path,
    path.join(process.cwd(), 'books', coverImgHandler.name),
  ).then(() => {
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
  }).then((newBook) => {
    const books = library.collection('books');
    return books.insertOne(newBook);
  }).then(() => { displayBooks(req, res); })
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.post('/books/rent', (req, res) => {
  const query = { _id: parseInt(req.fields.isbn, 10) };
  const dec = { $inc: { copies: -1 } };
  const rent = {
    renter: req.fields.username,
    isbn: parseInt(req.fields.isbn, 10),
  };

  const { error } = rentScheme.validate(rent);
  if (error != null) {
    res.status(400).send(error);
    return;
  }

  library.collection('books').findOne(query)
    .then((result) => {
      if (result === null || result.copies <= 0) {
        res.set({ 'Content-Type': 'text/plain' }).status(400).send(
          `Book with ISBN ${req.fields.isbn} not found in our library right now.`,
        );
      }
    })
    .then(() => {
      library.collection('books').updateOne(query, dec);
      return library.collection('users').findOne({ _id: rent.renter });
    })
    .then((result) => {
      if (!result) {
        library.collection('users').insertOne({ _id: rent.renter });
      }
    })
    .then(() => library.collection('rents').insertOne(rent))
    .then(() =>  {
      getBooksAndUsers()
        .then((result) => {
          res.render('rent_form', {
            books: result.books,
            users: result.users,
            success: {
              username: req.fields.username,
              isbn: req.fields.isbn,
            },
          });
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
  const bookQuerry = { _id: parseInt(req.fields.isbn, 10) };
  const rentQuerry = {
    renter: req.fields.username,
    isbn: parseInt(req.fields.isbn, 10),
  };
  const inc = { $inc: { copies: 1 } };

  const { error } = rentScheme.validate(rentQuerry);
  if (error != null) {
    res.status(400).send(error);
    return;
  }
  library.collection('rents').deleteOne(rentQuerry)
    .then((result) => {
      if (result.deletedCount < 1) {
        throw new Error(`User ${req.fields.username} has not rented book wit ISBN ${req.fields.isbn}`);
      }
      library.collection('books').updateOne(bookQuerry, inc);
    })
    .then(() => {
      getBooksAndUsers()
        .then((result) => {
          res.render('return_form', {
            books: result.books,
            users: result.users,
            success: {
              username: req.fields.username,
              isbn: req.fields.isbn,
            },
          });
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

export default router;

export async function connectDb() {
  try {
    library = await dbo.connect();
    library = library.db('library');
  } catch (err) {
    console.log('Could not connect to database.');
  }
}

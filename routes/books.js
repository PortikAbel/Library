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

router.post('/register', (req, res) => {
  const coverImgHandler = req.files.cover;

  res.set({
    'Content-Type': 'text/plain',
  });

  try {
    fs.rename(
      coverImgHandler.path,
      path.join(process.cwd(), 'books', coverImgHandler.name),
      (err) => { if (err) throw err; },
    );

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
    if (error) {
      throw new Error(error);
    }

    const books = library.collection('books');
    books.insertOne(newBook);
    res.send(`Book registered ${JSON.stringify(newBook)}`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/rent', (req, res) => {
  res.set({
    'Content-Type': 'text/plain',
  });

  try {
    const querry = { _id: parseInt(req.fields.isbn, 10) };
    const dec = { $inc: { copies: -1 } };
    const rent = {
      renter: req.fields.username,
      isbn: parseInt(req.fields.isbn, 10),
    };

    const { error } = rentScheme.validate(rent);
    if (error) {
      throw new Error(error);
    }

    library.collection('books')
      .findOne(querry)
      .then((result) => {
        if (result === null || result.copies <= 0) {
          throw new Error(
            `Book with ISBN ${req.fields.isbn} not found in our library right now.`,
          );
        }
      })
      .then(() => {
        library.collection('books').updateOne(querry, dec);
      })
      .then(() => library.collection('rents').insertOne(rent))
      .then(() =>  res.end(
        `User ${req.fields.username} rented book with isbn ${req.fields.isbn} succesfully`,
      ))
      .catch((err) => res.status(400).send(err.message));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/return', (req, res) => {
  res.set({
    'Content-Type': 'text/plain',
  });

  try {
    const bookQuerry = { _id: parseInt(req.fields.isbn, 10) };
    const rentQuerry = {
      renter: req.fields.username,
      isbn: parseInt(req.fields.isbn, 10),
    };
    const inc = { $inc: { copies: 1 } };

    const { error } = rentScheme.validate(rentQuerry);
    if (error) {
      throw new Error(error);
    }

    library.collection('rents')
      .deleteOne(rentQuerry)
      .then((result) => {
        if (result.deletedCount < 1) {
          throw new Error(`User ${req.fields.username} has not rented book wit ISBN ${req.fields.isbn}`);
        }
        library.collection('books').updateOne(bookQuerry, inc);
      })
      .then(() => res.send(`User ${req.fields.username} succesfully renturned book wit ISBN ${req.fields.isbn}`))
      .catch((err) => res.status(400).send(err.message));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;

export async function connectDb() {
  library = await dbo.connect()
    .then((db) =>  db.db('library'))
    .catch(() => console.log('Could not connect to database.'));
}

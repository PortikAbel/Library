import { Router } from 'express';
import { rentScheme } from '../scemes/libraryScemes.js';
import * as db from '../db/mongo.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { user } = req;
    const rents = await db.findRentsOfUser(user._id);
    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { user } = req;
    const rents = await db.findHistoryOfUser(user._id);
    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/:isbn', async (req, res) => {
  try {
    const isbn = parseInt(req.params.isbn, 10);
    const rents = await db.findRentsOfBook(isbn);
    res.json(rents);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user } = req;
    const rent = {
      renter: user._id,
      isbn: parseInt(req.body.isbn, 10),
      rentDate: req.body.date,
      returnDate: null,
    };
    const { error } = rentScheme.validate(rent);
    if (error != null) {
      throw error;
    }
    await db.rentBook(rent);
    res.json(rent);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/', async (req, res) => {
  try {
    const { user } = req;
    const { isbn, rentDate, date } = req.body;
    const query = {
      renter: user._id,
      isbn,
      rentDate,
    };

    const { error } = rentScheme.validate(query);
    if (error != null) {
      throw error;
    }

    await db.returnBook(query, date);
    res.json({ message: `You returned a book with ISBN ${query.isbn}` });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default router;

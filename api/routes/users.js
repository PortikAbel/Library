import { Router } from 'express';
import { rentScheme } from '../scemes/libraryScemes.js';
import * as db from '../db/mongo.js';

const router = Router();

router.get('/rents', async (req, res) => {
  try {
    const { user } = req;
    const rents = await db.findRentsOfUser(user._id);
    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/rents', async (req, res) => {
  try {
    const { user } = req;
    const rent = {
      renter: user._id,
      isbn: parseInt(req.body.isbn, 10),
      date: req.body.date,
    };
    const { error } = rentScheme.validate(rent);
    if (error != null) {
      throw error;
    }
    await db.rentBook(rent);
    res.json({ rent });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/rents', async (req, res) => {
  try {
    const { user } = req;
    const query = {
      renter: user._id,
      isbn: parseInt(req.body.isbn, 10),
      date: req.body.date,
    };

    const { error } = rentScheme.validate(query);
    if (error != null) {
      throw error;
    }

    await db.returnBook(query);
    res.json({
      success: true,
      message: `You returned book with ISBN ${query.isbn}`,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default router;

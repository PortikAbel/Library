import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../config/hashConfig.js';
import { rentScheme } from '../scemes/libraryScemes.js';
import * as db from '../db/mongo.js';

const router = Router();

router.get('/rents', async (req, res) => {
  try {
    const { token } = req.cookies;
    const username = jwt.verify(token, secret);
    const user = await db.findUser(username);
    const rents = await db.findRentsOfUser(username);
    const allBooks = await db.findBooks();
    res.render('rents_of_user', { rents, allBooks, user });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/rents', async (req, res) => {
  try {
    const { token } = req.cookies;
    const username = jwt.verify(token, secret);
    const rent = {
      renter: username,
      isbn: parseInt(req.body.isbn, 10),
      date: req.body.date,
    };

    const { error } = rentScheme.validate(rent);
    if (error != null) {
      throw error;
    }

    await db.rentBook(rent);
    res.json(rent);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/rents', async (req, res) => {
  try {
    const { token } = req.cookies;
    const username = jwt.verify(token, secret);
    const query = {
      renter: username,
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
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  const { username } = req.fields;

  db.deleteUser(username)
    .then(() => db.findUsers())
    .then((result) => {
      res.render('logout', { users: result, success: { username } });
    })
    .catch((err) => {
      db.findUsers()
        .then((result) => res.render('logout', { users: result, error: err.message }));
    });
});

export default router;

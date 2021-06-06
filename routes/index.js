import { Router } from 'express';
import * as db from '../db/mongo.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const books = await db.findBooks();
    const { user } = req;
    res.render('book_table', { books, user });
  } catch (err) {
    res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message);
  }
});

export default router;

import { Router } from 'express';
import * as db from '../db/mongo.js';

const router = Router();

router.get('/:isbn/rents', async (req, res) => {
  try {
    const isbn = parseInt(req.params.isbn, 10);
    const rents = await db.findRentsOfBook(isbn);
    res.json(rents);
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default router;

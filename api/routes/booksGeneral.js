import { Router } from 'express';
import * as db from '../db/mongo.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const books = await db.findBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json(({
      message: `Error while finding books: ${err.message}`,
    }));
  }
});

router.get('/:isbn/summary', async (req, res) => {
  const { isbn } = req.params;
  try {
    const summary = await db.findSummary(parseInt(isbn, 10));
    if (summary) {
      res.json(summary[0]);
    } else {
      res.status(404).json({
        message: `Book with ISBN ${isbn} not found`,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: `Error while finding summary of book with ISBN ${isbn}: ${err.message}`,
    });
  }
});

export default router;

import { Router } from 'express';
import * as db from '../db/mongo.js';

const router = Router();

router.get('/books/:isbn', (req, res) => {
  const { isbn } = req.params;
  db.findSummary(parseInt(isbn, 10))
    .then((summary) => (summary ? res.json(summary[0]) : res.status(404).json({
      message: `Book with ISBN ${isbn} not found`,
    })))
    .catch((err) => res.status(500).json({
      message: `Error while finding summary of book with ISBN ${isbn}: ${err.message}`,
    }));
});

export default router;

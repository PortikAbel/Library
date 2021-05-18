import { Router } from 'express';
import { unlinkSync } from 'fs';
import path from 'path';
import * as db from '../db/mongo.js';

const router = Router();

router.get('/:isbn', (req, res) => {
  const { isbn } = req.params;
  db.findSummary(parseInt(isbn, 10))
    .then((summary) => (summary ? res.json(summary[0]) : res.status(404).json({
      message: `Book with ISBN ${isbn} not found`,
    })))
    .catch((err) => res.status(500).json({
      message: `Error while finding summary of book with ISBN ${isbn}: ${err.message}`,
    }));
});

router.get('/:isbn/rents', (req, res) => {
  const isbn = parseInt(req.params.isbn, 10);
  db.findRentsOf(isbn)
    .then((result) => res.render('book_rents', { isbn, rents: result }))
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

router.delete('/:isbn', (req, res) => {
  const isbn = parseInt(req.params.isbn, 10);
  db.deleteBook(isbn)
    .then((result) => {
      if (result.success) {
        unlinkSync(path.join(process.cwd(), 'books', result.imageName));
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    })
    .catch((err) => res.status(500).json({
      message: `Error while deleting book with ISBN ${isbn}: ${err.message}`,
    }));
});

export default router;

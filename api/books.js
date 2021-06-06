import { Router } from 'express';
import { unlinkSync } from 'fs';
import path from 'path';
import * as db from '../db/mongo.js';
import checkAdmin from '../middleware/checkAdmin.js';

const router = Router();

router.get('/:isbn/summary', (req, res) => {
  const { isbn } = req.params;
  db.findSummary(parseInt(isbn, 10))
    .then((summary) => (summary ? res.json(summary[0]) : res.status(404).json({
      message: `Book with ISBN ${isbn} not found`,
    })))
    .catch((err) => res.status(500).json({
      message: `Error while finding summary of book with ISBN ${isbn}: ${err.message}`,
    }));
});

router.get('/:isbn/rents', async (req, res) => {
  try {
    const isbn = parseInt(req.params.isbn, 10);
    const rents = await db.findRentsOfBook(isbn);
    const { user } = req;
    res.render('book_rents', { isbn, rents, user });
  } catch (err) {
    res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message);
  }
});

router.use(checkAdmin);

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
      success: false,
      message: `Error while deleting book with ISBN ${isbn}: ${err.message}`,
    }));
});

export default router;

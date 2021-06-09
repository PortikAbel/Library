import { Router } from 'express';
import { unlinkSync } from 'fs';
import path from 'path';
import * as db from '../db/mongo.js';
import { registerSceme } from '../scemes/libraryScemes.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const {
      isbn, title, author, releasedate,
      summary, copies, cover,
    } = req.body;
    const newBook = {
      _id: parseInt(isbn, 10),
      title,
      author,
      releasedate,
      summary,
      copies: parseInt(copies, 10),
      imageName: cover,
    };
    const { error } = registerSceme.validate(newBook);
    if (error != null) {
      throw new Error(error);
    }
    await db.insertBook(newBook);
    res.json(newBook);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.delete('/:isbn', async (req, res) => {
  const isbn = parseInt(req.params.isbn, 10);
  try {
    const result = await db.deleteBook(isbn);
    if (result.success) {
      unlinkSync(path.join(process.cwd(), 'books', result.imageName));
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error while deleting book with ISBN ${isbn}: ${err.message}`,
    });
  }
});

export default router;

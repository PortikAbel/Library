import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { secret } from '../config/hashConfig.js';
import * as db from '../db/mongo.js';
import { registerSceme } from '../scemes/libraryScemes.js';

const router = Router();

router.get('/register', async (req, res) => {
  try {
    const { token } = req.cookies;
    const username = jwt.verify(token, secret);
    const user = await db.findUser(username);
    res.render('register_form', { user });
  } catch (err) {
    res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message);
  }
});

router.post('/register', (req, res) => {
  const coverImgHandler = req.files.cover;
  fs.promises.rename(
    coverImgHandler.path,
    path.join(process.cwd(), 'books', coverImgHandler.name),
  )
    .then(() => {
      const newBook = {
        _id: parseInt(req.fields.isbn, 10),
        title: req.fields.title,
        author: req.fields.author,
        releasedate: req.fields.releasedate,
        summary: req.fields.summary,
        copies: parseInt(req.fields.copies, 10),
        imageName: coverImgHandler.name,
      };
      const { error } = registerSceme.validate(newBook);
      if (error != null) {
        throw new Error(error);
      }
      return newBook;
    })
    .then((newBook) => db.insertBook(newBook))
    .then(() => { res.redirect('/'); })
    .catch((err) => res.set({ 'Content-Type': 'text/plain' }).status(400).send(err.message));
});

export default router;

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../config/hashConfig.js';
import * as db from '../db/mongo.js';
import { checkHash, createHash } from '../utils/hash.js';

const router = Router();

router.get('/login', (_req, res) => {
  res.render('login');
});

router.get('/logout', (_req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

router.get('/sign-up', (_req, res) => {
  res.render('sign_up');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.findUser(username);
    if (user && checkHash(password, user.hashWithSalt)) {
      const token = jwt.sign(username, secret);
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
      res.redirect('/');
    } else {
      res.status(401).send({ message: 'invalid credentials.' });
    }
  } catch (err) {
    res.render('login', { error: err.message });
  }
});

router.post('/sign-up', async (req, res) => {
  const { username, password } = req.fields;
  const hashWithSalt = await createHash(password);
  db.insertUser({ username, hashWithSalt })
    .then(() => res.redirect('/login'))
    .catch((err) => res.json({ error: err }));
});

export default router;

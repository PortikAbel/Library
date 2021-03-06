import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../config/hashConfig.js';
import * as db from '../db/mongo.js';
import { checkHash, createHash } from '../utils/hash.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(req.user);
});

router.post('/', async (req, res) => {
  const { _id, password } = req.body;
  try {
    const hashWithSalt = await createHash(password);
    await db.insertUser({ _id, hashWithSalt });
    const user = await db.findUser(_id);
    const token = jwt.sign(_id, secret);
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
    res.json(user);
  } catch (err) {
    res.json({ error: err });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.send({ message: 'logged out' });
});

router.post('/login', async (req, res) => {
  const { _id, password } = req.body;
  try {
    const user = await db.findUser(_id);
    if (user && checkHash(password, user.hashWithSalt)) {
      const token = jwt.sign(_id, secret);
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
      res.json(user);
    } else {
      res.status(401).send({ message: 'invalid credentials.' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

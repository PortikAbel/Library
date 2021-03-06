import express from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../config/hashConfig.js';
import * as db from '../db/mongo.js';
import { checkHash, createHash } from '../utils/hash.js';

const router = express();

router.put('/username', async (req, res) => {
  const { _id, password } = req.body;
  const { user } = req;
  try {
    if (user && checkHash(password, user.hashWithSalt)) {
      const newUser = {
        _id,
        hashWithSalt: user.hashWithSalt,
        admin: user.admin,
      };
      await db.insertUser(newUser);
      await db.updateRenter(user._id, _id);
      await db.deleteUser(user._id);
      const token = jwt.sign(newUser._id, secret);
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
      res.json(newUser);
    } else {
      res.status(401).send({ message: 'invalid credentials.' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/password', async (req, res) => {
  const { password, newPassword } = req.body;
  const { user } = req;
  try {
    if (user && checkHash(password, user.hashWithSalt)) {
      const hashWithSalt = await createHash(newPassword);
      await db.updateUser(user, { hashWithSalt });
      const newUser = await db.findUser(user._id);
      res.json(newUser);
    } else {
      res.status(401).send({ message: 'invalid credentials.' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

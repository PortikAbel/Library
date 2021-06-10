import express from 'express';
import * as db from '../db/mongo.js';

const router = express();

router.get('/', async (_req, res) => {
  try {
    const users = await db.findUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/', async (req, res) => {
  try {
    const { user, valuesToUpdate } = req.body;
    await db.updateUser(user, valuesToUpdate);
    const newUser = await db.findUser(user._id);
    res.json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

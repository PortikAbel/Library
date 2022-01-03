import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { secret } from '../config/hashConfig.js';
import * as db from '../db/mongo.js';

const router = Router();

router.use(async (req, _res, next) => {
  const { token } = req.cookies;
  if (token) {
    const username = jwt.verify(token, secret);
    req.user = await db.findUser(username);
  }
  next();
});

export default router;

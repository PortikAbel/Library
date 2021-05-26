import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { secret } from '../config/hashConfig.js';
import { findUser } from '../db/mongo.js';

const router = Router();

router.use(async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const username = jwt.verify(token, secret);
    const user = await findUser(username);
    if (user.admin) {
      next();
    } else {
      res.status(401);
      res.send({ method: 'unauthorized as admin' });
    }
  } else {
    res.status(401);
    res.send({ method: 'unauthorized as admin' });
  }
});

export default router;

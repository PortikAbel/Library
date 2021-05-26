import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { secret } from '../config/hashConfig.js';

const router = Router();

router.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret);
    next();
  } else {
    res.status(401);
    res.send({ method: 'unauthorized user' });
  }
});

export default router;

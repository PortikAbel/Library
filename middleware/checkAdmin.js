import { Router } from 'express';

const router = Router();

router.use(async (req, res, next) => {
  const { user } = req;
  if (user.admin) {
    next();
  } else {
    res.status(401);
    res.send({ method: 'unauthorized as admin' });
  }
});

export default router;

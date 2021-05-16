import { Router } from 'express';
import * as db from '../db/mongo.js';

const router = Router();

router.post('/users/sign-in', (req, res) => {
  const { username } = req.fields;
  db.insertUser(username)
    .then(() => res.render('sign_in', { success: { username } }))
    .catch((err) => res.render('sign_in', { error: err.message }));
});

router.post('/users/sign-out', (req, res) => {
  const { username } = req.fields;

  db.deleteUser(username)
    .then(() => db.findUsers())
    .then((result) => {
      res.render('sign_out', { users: result, success: { username } });
    })
    .catch((err) => {
      db.findUsers()
        .then((result) => res.render('sign_out', { users: result, error: err.message }));
    });
});

export default router;

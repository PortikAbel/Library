import { Router } from 'express';
import mongo from 'mongodb';

const url = 'mongodb://localhost:27017/';

const router = Router();

router.post('/register', (req, res) => {
  const coverImgHandler = req.files.cover;

  const newBook = {
    _id: req.fields.isbn,
    title: req.fields.title,
    author: req.fields.author,
    releasedate: req.fields.releasedate,
    summary: req.fields.summary,
    copies: req.fields.copies,
    imageName: coverImgHandler.name,
  };

  mongo.MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbo = db.db('library');
    console.log('Connected to db library');
    dbo.collection('books').insertOne(newBook, (insertErr) => {
      if (insertErr) throw insertErr;
      console.log('1 document inserted');
      db.close();
    });
  });

  res.set({
    'Content-Type': 'text/plain',
  });
});

router.post('/rent', (req, res) => {
  const respBody = `Book rent:
    username: ${req.fields.username}
    isbn: ${req.fields.isbn}
  `;

  console.log(respBody);
  res.set({
    'Content-Type': 'text/plain',
  });
  res.end(respBody);
});

router.post('/return', (req, res) => {
  const respBody = `Book return:
    username: ${req.fields.username}
    isbn: ${req.fields.isbn}
  `;

  console.log(respBody);
  res.set({
    'Content-Type': 'text/plain',
  });
  res.end(respBody);
});

export default router;

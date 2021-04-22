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

  mongo.MongoClient.connect(url, (err, client) => {
    if (err) throw err;
    const books = client.db('library').collection('books');
    books.insertOne(newBook);
    client.close();
  });

  res.set({
    'Content-Type': 'text/plain',
  });
  res.end(`Book registered ${JSON.stringify(newBook)}`);
});

router.post('/rent', (req, res) => {
  res.set({
    'Content-Type': 'text/plain',
  });

  mongo.MongoClient.connect(url)
    .then((client) => {
      const dbo = client.db('library');
      const querry = { _id: req.fields.isbn };
      const dec = { $inc: { copies: -1 } };
      const rent = {
        renter: req.fields.username,
        isbn: req.fields.isbn,
      };
      dbo.collection('books')
        .findOne(querry)
        .then((result) => {
          console.log(result);
          if (result === null || result.copies <= 0) {
            Promise.reject(new Error(
              `Book with ISBN ${req.fields.isbn} not found in our library right now.`,
            ));
          }
        })
        .catch((err) => res.status(400).send(err.message));

      dbo.collection('books')
        .updateOne(querry, dec)
        .catch((err) => res.status(400).send(err.message));

      dbo.collection('rents')
        .insertOne(rent)
        .then(() =>  res.end(
          `User ${req.fields.username} rented book with isbn ${req.fields.isbn} succesfully`,
        ))
        .catch((err) => res.status(400).send(err.message));

      client.close();
    });
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

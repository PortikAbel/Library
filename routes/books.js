import { Router } from 'express';

const router = Router();

router.post('/register', (req, res) => {
  const coverImgHandler = req.files.cover;

  const respBody = `Konyv regisztracio:
    isbn: ${req.fields.isbn}
    title: ${req.fields.title}
    author: ${req.fields.author}
    releasedate: ${req.fields.releasedate}
    summary: ${req.fields.summary}
    copies: ${req.fields.copies}
    cover photo name on server: ${coverImgHandler.path}
  `;

  console.log(respBody);
  res.set({
    'Content-Type': 'text/plain',
  });
  res.end(respBody);
});

module.exports = router;

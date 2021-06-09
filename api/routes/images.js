import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const coverImgHandler = req.files.cover;
    await fs.promises.rename(
      coverImgHandler.path,
      path.join(process.cwd(), 'images', coverImgHandler.name),
    );
    res.json({ imageName: coverImgHandler.name });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;

import express from 'express';
import path from 'path';

const staticDir = path.join(process.cwd(), 'static');

const app = express();

app.use(express.static(staticDir));

app.listen(5000);

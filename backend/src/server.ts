import 'dotenv/config';

import express from 'express';
import path from 'path';

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(process.env.APP_PORT, () => console.log('Server running'));
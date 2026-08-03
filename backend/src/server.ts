import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.listen(5000, () => console.log("ESM TS Express Backend running on port 5000"));
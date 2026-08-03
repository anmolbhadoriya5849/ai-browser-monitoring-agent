import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import prisma from './lib/prisma.js';

const app = express();

app.use(cors());
// Keep payload limit high for Base64 screenshots
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

interface TrackRequestBody {
  eventType: string;
  url: string;
  title?: string;
  timestamp: string;
  details?: Record<string, any>;
  screenshot: string;
}

app.post('/api/track', async (req: Request<{}, {}, TrackRequestBody>, res: Response) => {
  try {
    const { eventType, url, title, timestamp, details, screenshot } = req.body;

    // Insert record into Neon DB via Prisma
    const newLog = await prisma.visualLog.create({
      data: {
        eventType,
        url,
        title,
        timestamp: new Date(timestamp),
        details: details || {},
        screenshot
      }
    });

    res.status(201).json({
      success: true,
      message: "Log stored successfully in Neon DB",
      logId: newLog.id
    });
  } catch (error) {
    console.error("Prisma insertion error:", error);
    res.status(500).json({ error: "Failed to store record" });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Prisma Express Server running on port ${PORT}`));
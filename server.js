import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Traveloop API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

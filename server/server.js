import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes.js';
import { isFirebaseReady } from './config/firebase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev and preview origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'BIYA FASHION Backend API',
    tagline: 'WEAR YOUR STYLE',
    firebaseConnected: isFirebaseReady(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/orders', orderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({ error: 'Internal server error: ' + err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`👑 BIYA FASHION Express Backend Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔥 Firebase Status: ${isFirebaseReady() ? 'CONNECTED' : 'LOCAL FALLBACK (Active)'}`);
  console.log(`📄 Tax Invoice API: http://localhost:${PORT}/api/orders/:id/invoice`);
  console.log(`🏷️ Shipping Label API: http://localhost:${PORT}/api/orders/:id/shipping-label`);
  console.log(`📊 CSV Export API: http://localhost:${PORT}/api/orders/export/csv`);
  console.log(`===============================================`);
});

export default app;

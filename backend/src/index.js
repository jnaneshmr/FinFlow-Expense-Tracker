// src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const budgetRoutes = require('./routes/budget.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173', 
  process.env.FRONTEND_URL
];

app.use(cors({ 
  origin: '*',
  credentials: false 
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests, slow down.' } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '1.0.0', timestamp: new Date() }));
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.url} not found` }));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 FinFlow API running at http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

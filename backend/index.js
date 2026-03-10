require('dotenv').config();


const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes      = require('./routes/auth');
const timesheetRoutes = require('./routes/timesheets');
const invoiceRoutes   = require('./routes/invoices');
const dashboardRoutes = require('./routes/dashboard');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', status: 'ok' });
});

app.use('/api/auth',       authRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/invoices',   invoiceRoutes);
app.use('/api/dashboard',  dashboardRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

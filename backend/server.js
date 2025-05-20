const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const timeLineRoutes = require('./routes/timeLine');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------
// Middleware
// ---------------------------
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
 // allowed frontends
  credentials: true, // allow cookies to be sent
}));

// ---------------------------
// Routes
// ---------------------------
app.use('/api/auth', authRoutes);
app.use('/api/timeline',timeLineRoutes);


// ---------------------------
// MongoDB Connection
// ---------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Start server only after DB connection is successful
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});



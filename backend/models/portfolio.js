const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stockId: { type: String, required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  avgBuyPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = { Portfolio };

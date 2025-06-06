
const express = require('express');
const { Portfolio } = require('../models/portfolio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const FLASK_API_URL = 'http://localhost:8000';
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();
const axios = require('axios'); 

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authorization token not found. Please login again.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token. Please login again.' 
    });
  }
};

// GET: All portfolio items
router.get('/', authenticateUser, async (req, res) => {
  try {
    const portfolioItems = await Portfolio.find({ userId: req.userId });
    res.json(portfolioItems);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch portfolio items' 
    });
  }
});

// POST: Create a portfolio item
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { stockId, symbol, name, quantity, avgBuyPrice, currentPrice } = req.body;
    
    // Validate required fields
    if (!stockId || !symbol || !name || !quantity || !avgBuyPrice || !currentPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if stock already exists in portfolio
    const existingItem = await Portfolio.findOne({ 
      userId: req.userId, 
      stockId: stockId 
    });

    if (existingItem) {
      return res.status(400).json({ 
        success: false, 
        message: 'Stock already exists in portfolio' 
      });
    }

    const newPortfolioItem = new Portfolio({
      userId: req.userId,
      stockId,
      symbol,
      name,
      quantity: Number(quantity),
      avgBuyPrice: Number(avgBuyPrice),
      currentPrice: Number(currentPrice),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newPortfolioItem.save();
    res.status(201).json({
      success: true,
      message: 'Portfolio item created successfully',
      data: newPortfolioItem
    });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to create portfolio item' 
    });
  }
});

// PUT: Update a portfolio item
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { stockId, symbol, name, quantity, avgBuyPrice, currentPrice } = req.body;
    
    // Validate required fields
    if (!stockId || !symbol || !name || !quantity || !avgBuyPrice || !currentPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const portfolioItem = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        stockId,
        symbol,
        name,
        quantity: Number(quantity),
        avgBuyPrice: Number(avgBuyPrice),
        currentPrice: Number(currentPrice),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!portfolioItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Portfolio item not found' 
      });
    }

    res.json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: portfolioItem
    });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to update portfolio item' 
    });
  }
});

// DELETE: Delete a portfolio item
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!portfolioItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Portfolio item not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Portfolio item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to delete portfolio item' 
    });
  }
});

// POST: AI Analyze Portfolio
// POST: AI Analyze Portfolio
// router.post('/analyze', authenticateUser, async (req, res) => {
//   try {
//     console.log(`[${new Date().toISOString()}] Starting portfolio analysis for user: ${req.userId}`);
    
//     // Fetch portfolio items from database
//     const portfolioItems = await Portfolio.find({ userId: req.userId });

//     if (portfolioItems.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No portfolio items found to analyze'
//       });
//     }

//     console.log(`Found ${portfolioItems.length} portfolio items`);

//     // Calculate basic metrics (for validation and backup)
//     const totalValue = portfolioItems.reduce((sum, item) =>
//       sum + (Number(item.quantity) * Number(item.currentPrice)), 0);
//     const totalInvestment = portfolioItems.reduce((sum, item) =>
//       sum + (Number(item.quantity) * Number(item.avgBuyPrice)), 0);
//     const totalProfitLoss = totalValue - totalInvestment;
//     const profitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

//     // Prepare data for Flask API
//     const portfolioData = {
//       portfolioItems: portfolioItems.map(item => ({
//         symbol: item.symbol,
//         name: item.name,
//         quantity: Number(item.quantity),
//         avgBuyPrice: Number(item.avgBuyPrice),
//         currentPrice: Number(item.currentPrice),
//         // Include any additional fields if needed
//         sector: item.sector || null,
//         industry: item.industry || null
//       }))
//     };

//     console.log('Calling Flask API for AI analysis...');

//     // Call Flask API for AI analysis
//     try {
//       const flaskResponse = await fetch(`${FLASK_API_URL}/analyze`, portfolioData, {
//         timeout: 30000, // 30 seconds timeout
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Flask API response received successfully');

//       // Check if Flask API returned success
//       if (flaskResponse.data && flaskResponse.data.success) {
//         // Return Flask API response
//         return res.json({
//           success: true,
//           metrics: flaskResponse.data.metrics,
//           analysis: flaskResponse.data.analysis,
//           timestamp: flaskResponse.data.timestamp,
//           itemsAnalyzed: flaskResponse.data.itemsAnalyzed,
//           source: 'flask-ai' // Indicates the analysis came from Flask AI service
//         });
//       } else {
//         throw new Error(flaskResponse.data?.message || 'Flask API returned unsuccessful response');
//       }

//     } catch (flaskError) {
//       console.error('Flask API Error:', flaskError.message);
      
//       // Log additional details for debugging
//       if (flaskError.response) {
//         console.error('Flask API Error Status:', flaskError.response.status);
//         console.error('Flask API Error Data:', flaskError.response.data);
//       } else if (flaskError.request) {
//         console.error('Flask API Connection Error - No response received');
//       }
      
//       // Fallback: Return basic metrics without AI analysis
//       return res.json({
//         success: true,
//         metrics: {
//           totalValue: parseFloat(totalValue.toFixed(2)),
//           totalInvestment: parseFloat(totalInvestment.toFixed(2)),
//           totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
//           profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2))
//         },
//         analysis: `## Portfolio Overview

// Your portfolio consists of ${portfolioItems.length} holdings with a total value of ₹${totalValue.toFixed(2)}.

// **Performance Summary:**
// - Total Investment: ₹${totalInvestment.toFixed(2)}
// - Current Value: ₹${totalValue.toFixed(2)}
// - Profit/Loss: ₹${totalProfitLoss.toFixed(2)} (${profitLossPercentage.toFixed(2)}%)

// **Holdings:**
// ${portfolioItems.map(item => 
//   `- ${item.symbol}: ${item.quantity} shares @ ₹${item.avgBuyPrice} (Current: ₹${item.currentPrice})`
// ).join('\n')}

// *Note: Detailed AI analysis is temporarily unavailable. Basic metrics are provided above.*`,
//         timestamp: new Date().toISOString(),
//         itemsAnalyzed: portfolioItems.length,
//         source: 'basic-calculation',
//         warning: 'AI analysis service unavailable - showing basic metrics only'
//       });
//     }

//   } catch (error) {
//     console.error('Error analyzing portfolio:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to analyze portfolio',
//       error: error.message
//     });
//   }
// });



module.exports = router;



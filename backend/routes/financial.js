const express = require('express');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb'); // Add this import
const router = express.Router();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const documents = mongoose.connection.collection('documents');
const daily_prices= mongoose.connection.collection('daily_prices');
// Then use: await documents.findOne({ _id: new ObjectId(id) });
dotenv.config();

// You need to define JWT_SECRET and documents collection
const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is defined in your .env file
// You need to import/define your MongoDB documents collection here
// const { documents } = require('./path-to-your-db-config');

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

// Fixed route: added missing '/' and corrected parameter extraction
router.get("/financial-data/:id", authenticateUser, async (req, res) => {
    const { id } = req.params; // Fixed: destructure id from req.params
    
    try {
        const financialData = await documents.findOne({ _id: new ObjectId(id) });
        
        if (!financialData) {
            return res.status(404).json({ 
                success: false, 
                message: 'Financial data not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            financialData: financialData.summary
        });
    } catch (error) {
        console.error('Error fetching financial data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

function getCurrentDateString(){
    // Format to match "2025-06-14"
    return new Date().toISOString().split('T')[0];
}

router.get('/stocks/:id', async (req, res) => {
  const { id } = req.params;
  const today = getCurrentDateString();

  try {
    // Query by id and fetched_at_date matching today
    const stock = await daily_prices.findOne({ 
      id: id, 
      fetched_at_date: today 
    });

    if (stock) {
      res.json(stock);
    } else {
      res.status(404).json({ message: "Stock not found for today" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
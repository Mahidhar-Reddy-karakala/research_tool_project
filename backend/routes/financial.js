const express = require('express');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb'); // Add this import
const router = express.Router();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const documents = mongoose.connection.collection('documents');
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

module.exports = router;
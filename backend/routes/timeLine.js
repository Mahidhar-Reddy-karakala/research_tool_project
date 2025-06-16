
// const express = require('express');
// const jwt = require("jsonwebtoken");
// const { addTimelineEntry, getTimeLineEntries, updateTimelineEntry, deleteTimelineEntry } = require('../models/User');
// const dotenv = require('dotenv');
// dotenv.config();

// const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// /**
//  * Middleware to authenticate the user and extract userId from JWT
//  */
// const authenticateUser = (req, res, next) => {
//   const token = req.cookies.authToken;

//   if (!token) {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'Authorization token not found. Please login again.' 
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.sub;
//     next();
//   } catch (error) {
//     console.error('JWT verification error:', error);
//     res.status(403).json({ 
//       success: false, 
//       message: 'Invalid or expired token. Please login again.' 
//     });
//   }
// };

// /**
//  * @route   GET /api/timeline/userId
//  * @desc    Get the userId from the JWT token (and verify authentication)
//  * @access  Private
//  */
// router.get('/userId', authenticateUser, (req, res) => {
//   res.json({ success: true, userId: req.userId });
// });

// /**
//  * @route   POST /api/timeline/add
//  * @desc    Add a new timeline entry
//  * @access  Private
//  */
// router.post('/add', authenticateUser, async (req, res) => {
//   const userId = req.userId;
//   const { date, note, company } = req.body;
  
//   if (!note || !company) {
//     return res.status(400).json({ 
//       success: false, 
//       message: "Both 'note' and 'company' fields are required" 
//     });
//   }

//   try {
//     const entry = {
//       date: date || new Date().toISOString().split('T')[0],
//       note,
//       company
//     };
    
//     const result = await addTimelineEntry(userId, entry);
    
//     // Get the updated entries to return the newly created entry with its _id
//     const entries = await getTimeLineEntries(userId);
//     const newEntry = entries.length > 0 ? entries[entries.length - 1] : null;
    
//     res.status(201).json({ 
//       success: true, 
//       message: "Timeline entry added successfully",
//       data: newEntry
//     });
//   } catch (error) {
//     console.error('Error adding timeline entry:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Error adding timeline entry" 
//     });
//   }
// });

// /**
//  * @route   GET /api/timeline/fetch
//  * @desc    Get all timeline entries for a user
//  * @access  Private
//  */
// router.get('/fetch', authenticateUser, async (req, res) => {
//   const userId = req.userId;

//   try {
//     const entries = await getTimeLineEntries(userId);
//     res.status(200).json({ 
//       success: true, 
//       data: entries 
//     });
//   } catch (error) {
//     console.error('Error fetching timeline entries:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error fetching timeline entries' 
//     });
//   }
// });

// /**
//  * @route   PUT /api/timeline/update/:entryId
//  * @desc    Update a timeline entry
//  * @access  Private
//  */
// router.put('/update/:entryId', authenticateUser, async (req, res) => {
//   const userId = req.userId;
//   const { entryId } = req.params;
//   const { date, note, company } = req.body;

//   if (!entryId) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Entry ID is required' 
//     });
//   }

//   if (!date && !note && !company) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'At least one field to update is required' 
//     });
//   }

//   try {
//     const updatedEntry = { date, note, company };
//     const result = await updateTimelineEntry(userId, entryId, updatedEntry);
    
//     // Get the updated entry after modification
//     const entries = await getTimeLineEntries(userId);
//     const updatedEntryFromDB = entries.find(entry => entry._id.toString() === entryId);

//     if (!updatedEntryFromDB) {
//       return res.status(404).json({
//         success: false,
//         message: 'Entry not found after update'
//       });
//     }

//     res.status(200).json({ 
//       success: true, 
//       message: `Timeline entry updated successfully`,
//       data: updatedEntryFromDB
//     });
//   } catch (error) {
//     console.error('Error updating timeline entry:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error updating timeline entry' 
//     });
//   }
// });

// /**
//  * @route   DELETE /api/timeline/delete/:entryId
//  * @desc    Delete a timeline entry
//  * @access  Private
//  */
// router.delete('/delete/:entryId', authenticateUser, async (req, res) => {
//   const userId = req.userId;
//   const { entryId } = req.params;

//   if (!entryId) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Entry ID is required' 
//     });
//   }

//   try {
//     await deleteTimelineEntry(userId, entryId);
//     res.status(200).json({ 
//       success: true, 
//       message: `Timeline entry deleted successfully`
//     });
//   } catch (error) {
//     console.error('Error deleting timeline entry:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error deleting timeline entry' 
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const Timeline = require('../models/Timeline'); // Adjust the path as necessary

const router = express.Router();

// Get timeline entries for a specific stock
router.get('/stock/:stockId', async (req, res) => {
  try {
    const entries = await Timeline.find({ stockId: req.params.stockId })
      .select("_id stockId date type note createdAt")
      .sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline entries' });
  }
});

// Get all stocks that have timeline entries
router.get('/stocks-with-entries', async (req, res) => {
  try {
    const stocks = await Timeline.distinct('stockId');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stocks with timeline entries' });
  }
});

// Create timeline entry
router.post('/', async (req, res) => {
  try {
    const timelineEntry = new Timeline(req.body);
    await timelineEntry.save();
    res.status(201).json(timelineEntry);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'An entry already exists for this stock on the selected date' });
    } else {
      res.status(400).json({ error: 'Failed to create timeline entry' });
    }
  }
});

// Update timeline entry
router.put('/:id', async (req, res) => {
  try {
    const timelineEntry = await Timeline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!timelineEntry) {
      return res.status(404).json({ error: 'Timeline entry not found' });
    }
    res.json(timelineEntry);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update timeline entry' });
  }
});

// Delete timeline entry
router.delete('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const timelineEntry = await Timeline.findByIdAndDelete(req.params.id);
    if (!timelineEntry) {
      return res.status(404).json({ error: 'Timeline entry not found' });
    }
    res.json({ message: 'Timeline entry deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete timeline entry' });
  }
});

module.exports= router;
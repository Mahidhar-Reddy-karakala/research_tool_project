// const express = require('express');
// const jwt=require("jsonwebtoken");
// const {addTimelineEntry,getTimeLineEntries,updateTimelineEntry,deleteTimelineEntry} = require('../models/User');
// const dotenv = require('dotenv');
// dotenv.config();

// const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


// /**
//  * Middleware to authenticate the user and extract userId from JWT
//  */
// const authenticateUser = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: 'Authorization token not found' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.sub;
//     next();
//   } catch (error) {
//     console.error('JWT verification error:', error);
//     res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };



// /**
//  * @route   POST /api/timeline/:userId/:company
//  * @desc    Add a new timeline entry for a specific company
//  * @access  Public (Adjust according to authentication strategy)
//  */
// router.get('/userId', authenticateUser, (req, res) => {
//   res.json({ userId: req.userId });
// });

// router.post('/add',authenticateUser,async (req,res)=>{
//     const userId=req.userId;
//     const {date,note,company}=req.body;
//     if (!note || !company) {
//     return res.status(400).json({ message: "Both 'note' and 'company' fields are required" });
//     }

//     try{
//         const entry={
//             date,
//             note,
//             company
//         }
//         await addTimelineEntry(userId,entry);
//         res.status(201).json({message:"Timeline entry added successfully"});
//     }catch(error){
//         console.error('Error adding timeline entry:',error);
//         res.status(500).json({message:"Error adding timeline entry"});      
//     }
// })

// router.get('/fetch', authenticateUser, async (req, res) => {
//   const userId = req.userId;

//   try {
//     const entries = await getTimeLineEntries(userId);
//     res.status(200).json({ success: true, data: entries });
//   } catch (error) {
//     console.error('Error fetching timeline entries:', error);
//     res.status(500).json({ success: false, message: 'Error fetching timeline entries' });
//   }
// });

// router.put('/update/:entryId', authenticateUser, async (req, res) => {
//   const userId = req.userId;
//   const { entryId } = req.params;
//   const { date, note, company } = req.body;

//   if (!date && !note && !company && !entryId) {
//     return res.status(400).json({ message: 'At least one field to update is required' });
//   }

//   try {
//     const updatedEntry = { date, note, company };
//     await updateTimelineEntry(userId, entryId, updatedEntry);

//     res.status(200).json({ success: true, message: `Timeline entry with ID ${entryId} updated successfully` });

//   } catch (error) {
//     console.error('Error updating timeline entry:', error);
//     res.status(500).json({ success: false, message: 'Error updating timeline entry' });
//   }
// });

// router.delete('/delete/:entryId', authenticateUser, async (req, res) => {
//   const userId = req.userId;
//   const { entryId } = req.params;

//   try {
//     await deleteTimelineEntry(userId, entryId);
//     res.status(200).json({ success: true, message: `Timeline entry with ID ${entryId} deleted successfully` });

//   } catch (error) {
//     console.error('Error deleting timeline entry:', error);
//     res.status(500).json({ success: false, message: 'Error deleting timeline entry' });
//   }
// });

// module.exports=router;

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
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Authorization token not found' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.sub;
//     next();
//   } catch (error) {
//     console.error('JWT verification error:', error);
//     res.status(403).json({ success: false, message: 'Invalid or expired token' });
//   }
// };

// /**
//  * @route   GET /api/timeline/userId
//  * @desc    Get the userId from the JWT token
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
//     // Return the created entry with its _id
//     res.status(201).json({ 
//       success: true, 
//       message: "Timeline entry added successfully",
//       data: result
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
//     res.status(200).json({ success: true, data: entries });
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
const jwt = require("jsonwebtoken");
const { addTimelineEntry, getTimeLineEntries, updateTimelineEntry, deleteTimelineEntry } = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Middleware to authenticate the user and extract userId from JWT
 */
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

/**
 * @route   GET /api/timeline/userId
 * @desc    Get the userId from the JWT token (and verify authentication)
 * @access  Private
 */
router.get('/userId', authenticateUser, (req, res) => {
  res.json({ success: true, userId: req.userId });
});

/**
 * @route   POST /api/timeline/add
 * @desc    Add a new timeline entry
 * @access  Private
 */
router.post('/add', authenticateUser, async (req, res) => {
  const userId = req.userId;
  const { date, note, company } = req.body;
  
  if (!note || !company) {
    return res.status(400).json({ 
      success: false, 
      message: "Both 'note' and 'company' fields are required" 
    });
  }

  try {
    const entry = {
      date: date || new Date().toISOString().split('T')[0],
      note,
      company
    };
    
    const result = await addTimelineEntry(userId, entry);
    
    // Get the updated entries to return the newly created entry with its _id
    const entries = await getTimeLineEntries(userId);
    const newEntry = entries.length > 0 ? entries[entries.length - 1] : null;
    
    res.status(201).json({ 
      success: true, 
      message: "Timeline entry added successfully",
      data: newEntry
    });
  } catch (error) {
    console.error('Error adding timeline entry:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error adding timeline entry" 
    });
  }
});

/**
 * @route   GET /api/timeline/fetch
 * @desc    Get all timeline entries for a user
 * @access  Private
 */
router.get('/fetch', authenticateUser, async (req, res) => {
  const userId = req.userId;

  try {
    const entries = await getTimeLineEntries(userId);
    res.status(200).json({ 
      success: true, 
      data: entries 
    });
  } catch (error) {
    console.error('Error fetching timeline entries:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching timeline entries' 
    });
  }
});

/**
 * @route   PUT /api/timeline/update/:entryId
 * @desc    Update a timeline entry
 * @access  Private
 */
router.put('/update/:entryId', authenticateUser, async (req, res) => {
  const userId = req.userId;
  const { entryId } = req.params;
  const { date, note, company } = req.body;

  if (!entryId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Entry ID is required' 
    });
  }

  if (!date && !note && !company) {
    return res.status(400).json({ 
      success: false, 
      message: 'At least one field to update is required' 
    });
  }

  try {
    const updatedEntry = { date, note, company };
    const result = await updateTimelineEntry(userId, entryId, updatedEntry);
    
    // Get the updated entry after modification
    const entries = await getTimeLineEntries(userId);
    const updatedEntryFromDB = entries.find(entry => entry._id.toString() === entryId);

    if (!updatedEntryFromDB) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found after update'
      });
    }

    res.status(200).json({ 
      success: true, 
      message: `Timeline entry updated successfully`,
      data: updatedEntryFromDB
    });
  } catch (error) {
    console.error('Error updating timeline entry:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating timeline entry' 
    });
  }
});

/**
 * @route   DELETE /api/timeline/delete/:entryId
 * @desc    Delete a timeline entry
 * @access  Private
 */
router.delete('/delete/:entryId', authenticateUser, async (req, res) => {
  const userId = req.userId;
  const { entryId } = req.params;

  if (!entryId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Entry ID is required' 
    });
  }

  try {
    await deleteTimelineEntry(userId, entryId);
    res.status(200).json({ 
      success: true, 
      message: `Timeline entry deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting timeline entry:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting timeline entry' 
    });
  }
});

module.exports = router;
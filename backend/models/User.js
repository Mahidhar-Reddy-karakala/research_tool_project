const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Define User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  timelines: [
    {
      entries: [
        {
          date: {
            type: String,
            required: true,
            default: () => new Date().toISOString().split('T')[0]
          },
          note: {
            type: String,
            required: true
          },
          company: {
            type: String,
            required: true
          }
        }
      ]
    }
  ]
});

// Middleware: Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    throw new Error('Error comparing passwords');
  }
};

const User = mongoose.model('User', userSchema);

// Add a timeline entry
const addTimelineEntry = async (userId, entry) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }
    
    const newEntry = {
      date: entry.date || new Date().toISOString().split('T')[0],
      note: entry.note,
      company: entry.company,
    };

    if (user.timelines.length === 0) {
      user.timelines.push({ entries: [newEntry] });
    } else {
      user.timelines[0].entries.push(newEntry);
    }
    
    await user.save();
    console.log('Timeline entry added successfully');
    
    // Return the newly created entry with _id
    const addedEntry = user.timelines[0].entries[user.timelines[0].entries.length - 1];
    return addedEntry;
  } catch (error) {
    console.error('Error adding timeline entry:', error);
    throw error;
  }
};

// Get timeline entries
const getTimeLineEntries = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user && user.timelines.length > 0) {
      return user.timelines[0].entries || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching timeline entries:', error);
    return [];
  }
};

// Update a timeline entry
const updateTimelineEntry = async (userId, entryId, updatedEntry) => {
  try {
    // Trim any leading/trailing whitespace and newline characters
    entryId = entryId.trim();

    // Convert entryId to ObjectId if necessary
    const ObjectId = mongoose.Types.ObjectId;
    if (!ObjectId.isValid(entryId)) {
      throw new Error('Invalid entryId');
    }

    const updateFields = {};

    // Set fields if provided in updatedEntry
    if (updatedEntry.date) updateFields['timelines.$[].entries.$[entry].date'] = updatedEntry.date;
    if (updatedEntry.company) updateFields['timelines.$[].entries.$[entry].company'] = updatedEntry.company;
    if (updatedEntry.note) updateFields['timelines.$[].entries.$[entry].note'] = updatedEntry.note;

    const result = await User.updateOne(
      { _id: userId, 'timelines.entries._id': entryId }, // Match user and entryId in timelines.entries
      { $set: updateFields }, // Set the fields
      {
        arrayFilters: [
          { 'entry._id': entryId } // Filter entry by entryId in timelines.entries
        ]
      }
    );

    if (result.modifiedCount === 0) {
      console.log(`No matching entry found to update for user ${userId}`);
    } else {
      console.log(`Timeline entry with ID ${entryId} updated successfully for user ${userId}`);
    }

    return result; // Return the result to check if any changes were made
  } catch (error) {
    console.error(`Error updating timeline entry for user ${userId}:`, error);
    throw new Error('Error updating timeline entry');
  }
};









// Delete a specific timeline entry


const deleteTimelineEntry = async (userId, entryId) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;

    // Ensure entryId is a valid ObjectId
    entryId = entryId.trim();
    if (!ObjectId.isValid(entryId)) {
      throw new Error('Invalid entryId');
    }

    const result = await User.updateOne(
      { _id: userId },
      { $pull: { 'timelines.$[].entries': { _id: entryId } } }
    );

    if (result.modifiedCount === 0) {
      console.log(`No matching entry found to delete for user ${userId}`);
    } else {
      console.log(`Timeline entry with ID ${entryId} deleted successfully for user ${userId}`);
    }

    return result;
  } catch (error) {
    console.error('Error deleting timeline entry:', error);
    throw new Error('Error deleting timeline entry');
  }
};




module.exports = { User, addTimelineEntry, getTimeLineEntries, updateTimelineEntry, deleteTimelineEntry };

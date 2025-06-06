const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  stockId: { 
    type: String, 
    required: true 
  },
  note: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['analysis', 'news', 'price-target']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to prevent duplicate entries for the same stock on the same date
timelineSchema.index({ stockId: 1, date: 1 }, { unique: true });

const Timeline = mongoose.model('Timeline', timelineSchema);
module.exports = Timeline;

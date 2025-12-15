const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String, 
      required: true,
      trim: true
    },
    reportedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'closed'],
      default: 'pending'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Index for faster queries
issueSchema.index({ reportedBy: 1, createdAt: -1 });
issueSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Issue', issueSchema);


const mongoose = require('mongoose');
const { Schema } = mongoose;

// Alert history for device alarms (e.g., SOS, Low Battery, Crash Detection)
const alertSchema = new Schema(
  {
    device_id: { type: String, required: true, index: true },
    gateway: { type: Schema.Types.ObjectId, ref: 'Gateway' },
    type: {
      type: String,
      enum: ['sos', 'low_battery', 'crash_detection', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'acknowledged', 'resolved'],
      default: 'open',
      index: true,
    },
    battery: { type: Number, min: 0, max: 100 },
    signal_quality: {
      type: String,
      enum: ['strong', 'medium', 'weak', 'none'],
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    payload: { type: Schema.Types.Mixed },
    notes: { type: String },
    acknowledged_at: { type: Date },
    resolved_at: { type: Date },
  },
  { timestamps: true }
);

// Useful indexes for querying history
alertSchema.index({ device_id: 1, createdAt: -1 });
alertSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);

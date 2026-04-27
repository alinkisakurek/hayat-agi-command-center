const mongoose = require('mongoose');
const { Schema } = mongoose;

// Alert history for device alarms (e.g., SOS, Low Battery, Crash Detection)
const alertSchema = new Schema(
  {
    device_id: { type: String, required: true, index: true },
    gateway: { type: Schema.Types.ObjectId, ref: 'Gateway' },
    type: {
      type: String,
      enum: ['sos', 'low_battery', 'crash_detection', 'manual_message', 'other'],
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

    // Fusion / classification pipeline fields.
    // text is first-class so the fusion service can index/query without
    // unpacking payload. payload itself stays for backwards-compatibility
    // with anything already writing { message, sentAt } there.
    text: { type: String, default: null },
    lang: { type: String, default: 'tr' },
    source_user: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    // Fusion service owns Incidents in its own DB (Postgres), so this is
    // a foreign reference by id-string, not a Mongo ref.
    incident: { type: String, default: null, index: true },

    // Written back by the fusion classifier once an alert has been scored.
    // Stays null until the model has run.
    classification: {
      emergency_category: { type: String, default: null },
      severity: { type: Number, min: 0, max: 1, default: null },
      confidence: { type: Number, min: 0, max: 1, default: null },
      model_version: { type: String, default: null },
      classified_at: { type: Date, default: null },
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
// Fusion polls for alerts that haven't been classified yet.
alertSchema.index({ 'classification.classified_at': 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);

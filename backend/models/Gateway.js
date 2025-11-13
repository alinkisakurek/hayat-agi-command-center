const mongoose = require('mongoose');

const gatewaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
      address: { type: String },
    },
    battery: { type: Number, min: 0, max: 100, default: null },
    online: { type: Boolean, default: false },
    lastSeenAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gateway', gatewaySchema);

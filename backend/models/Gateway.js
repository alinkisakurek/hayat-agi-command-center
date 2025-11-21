const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gatewaySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'low_battery'], 
    default: 'inactive'
  },
  battery: {
    type: Number,
    min: 0,
    max: 100, 
    default: 0
  },
  signal_quality: {
    type: String,
    enum: ['strong', 'medium', 'weak', 'none'], 
    default: 'none'
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  connected_devices: {
    type: Number,
    default: 0 
  },
  uptime: {
    type: Number, 
    default: 0
  },
  last_seen: {
    type: Date,
    default: Date.now 
  }
}, {
  timestamps: true 
});

module.exports = gatewaySchema;
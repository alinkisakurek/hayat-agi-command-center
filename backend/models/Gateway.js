const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { HEALTH_OPTIONS, GENDER_LABELS } = require('../utils/constants');

const addressSchema = new Schema({
  street: { type: String, default: '' },       // Cadde / Sokak
  buildingNo: { type: String, default: '' },   // Bina No (Dış Kapı)
  doorNo: { type: String, default: '' },       // İç Kapı No (Daire) 
  neighborhood: { type: String, default: '' }, // Mahalle 
  district: { type: String, default: '' },     // İlçe 
  province: { type: String, default: '' },     // İl 
  postalCode: { type: String, default: '' }
}, { _id: false });

const registeredUserSchema = new Schema({
  fullname: { type: String, required: true, trim: true },
  tcNumber: {
    type: String,
    trim: true,
  },

  gender: { type: String, enum: Object.keys(GENDER_LABELS), default: 'prefer_not_to_say' },
  birthDate: { type: Date, default: null },
  bloodType: { type: String, enum: HEALTH_OPTIONS.bloodGroups, default: 'Bilinmiyor' },
  medicalConditions: { type: [String], enum: HEALTH_OPTIONS.chronicConditions, default: [] },
  prosthetics: { type: [String], enum: HEALTH_OPTIONS.prostheses, default: [] },
  medications: { type: [String], enum: HEALTH_OPTIONS.medications, default: [] },
}, { _id: true });

const registeredAnimalSchema = new Schema({
  name: { type: String, default: '', trim: true },
  species: { type: String, default: '', trim: true },
  breed: { type: String, default: '', trim: true },
  microchipId: { type: String, trim: true }
})


const gatewaySchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    unique: true,
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

  address: {
    type: addressSchema,
    required: true,
    default: () => ({})
  },

  registered_users: {
    type: [registeredUserSchema],
    default: []
  },

  registered_animals: {
    type: [registeredAnimalSchema],
    default: []
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

// Tüm 'registered_users' dizilerindeki 'tcNumber' alanı benzersiz olsun (Boş değilse)
gatewaySchema.index(
  { "registered_users.tcNumber": 1 },
  { unique: true, sparse: true, background: true }
);

// Tüm 'registered_animals' dizilerindeki 'microchipId' alanı benzersiz olsun (Boş değilse)
gatewaySchema.index(
  { "registered_animals.microchipId": 1 },
  { unique: true, sparse: true, background: true }
);
module.exports = mongoose.model('Gateway', gatewaySchema);
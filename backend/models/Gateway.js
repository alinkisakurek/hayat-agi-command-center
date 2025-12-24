const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { HEALTH_OPTIONS } = require('../utils/constants');
const { GENDER_LABELS, DEMOGRAPHIC_RISK } = require('../utils/demographic');
const { BILISSEL_ILETISIM_DUYUSAL_RISK } = require('../utils/others');

const getAllMedicalConditions = () => {
  let conditions = [];
  for (const key in HEALTH_OPTIONS) {
    if (key !== 'KAN_GRUBU' && HEALTH_OPTIONS[key].hastaliklar) {
      conditions = [...conditions, ...HEALTH_OPTIONS[key].hastaliklar];
    }
  }
  return conditions;
};
const ALL_MEDICAL_CONDITIONS = getAllMedicalConditions();


const addressSchema = new Schema({
  street: { type: String, default: '' },
  buildingNo: { type: String, default: '' },
  doorNo: { type: String, default: '' },
  neighborhood: { type: String, default: '' },
  district: { type: String, default: '' },
  province: { type: String, default: '' },
  postalCode: { type: String, default: '' }
}, { _id: false });


const registeredUserSchema = new Schema({
  fullname: { type: String, required: true, trim: true },

  // TC Opsiyonel (User.js ile uyumlu)
  tcNumber: {
    type: String,
    trim: true,
  },


  gender: {
    type: String,
    enum: Object.keys(GENDER_LABELS),
    default: null
  },

  birthDate: { type: Date, default: null },


  bloodType: {
    type: String,
    enum: HEALTH_OPTIONS.KAN_GRUBU,
    default: null
  },


  medicalConditions: {
    type: [String],
    enum: ALL_MEDICAL_CONDITIONS,
    default: []
  },


  demographicRisks: {
    type: [String],
    enum: Object.keys(DEMOGRAPHIC_RISK),
    default: []
  },


  sensoryAndCognitiveRisks: {
    type: [String],
    enum: BILISSEL_ILETISIM_DUYUSAL_RISK.hastaliklar,
    default: []
  },



}, { _id: true });


const registeredAnimalSchema = new Schema({
  name: { type: String, default: '', trim: true },
  species: { type: String, default: '', trim: true },
  breed: { type: String, default: '', trim: true },
  microchipId: { type: String, trim: true }
});


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

  connected_devices: { type: Number, default: 0 },
  uptime: { type: Number, default: 0 },
  last_seen: { type: Date, default: Date.now }
}, {
  timestamps: true
});


gatewaySchema.index(
  { "registered_users.tcNumber": 1 },
  { unique: true, sparse: true, background: true }
);

gatewaySchema.index(
  { "registered_animals.microchipId": 1 },
  { unique: true, sparse: true, background: true }
);

module.exports = mongoose.model('Gateway', gatewaySchema);
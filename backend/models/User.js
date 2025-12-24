const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Constants importları (Doğru yollardan emin ol)
const { HEALTH_OPTIONS } = require('../utils/constants');
const { GENDER_LABELS, DEMOGRAPHIC_RISK } = require('../utils/demographic');
const { BILISSEL_ILETISIM_DUYUSAL_RISK } = require("../utils/others");

const Schema = mongoose.Schema;

const emergencyContactUserSchema = new Schema({
  fullname: { type: String, default: '', trim: true },
  phone: { type: String, default: '', trim: true },
  relation: { type: String, default: '', trim: true }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, trim: true },
    surname: { type: String, required: true, minlength: 2, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'citizen'], default: 'citizen' },
    phoneNumber: { type: String, default: null, trim: true, required: true },

    tcNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          if (!/^\d{11}$/.test(v)) return false;
          if (v[0] === '0') return false;
          const d = v.split('').map(Number);
          const oddSum = d[0] + d[2] + d[4] + d[6] + d[8];
          const evenSum = d[1] + d[3] + d[5] + d[7];
          const d10 = ((oddSum * 7) - evenSum) % 10;
          const d11 = (d.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;
          return d[9] === d10 && d[10] === d11;
        },
        message: 'Geçersiz TC Kimlik Numarası'
      }
    },

    isVerified: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    emergencyContact: { type: emergencyContactUserSchema, default: () => ({}) },
    birthDate: { type: Date, default: null },

    // Cinsiyet (Artık demographic.js'den geliyor)
    gender: {
      type: String,
      enum: Object.keys(GENDER_LABELS),
      default: null,
    },

    // --- SAĞLIK PROFİLİ ---
    bloodType: { type: String, enum: HEALTH_OPTIONS.KAN_GRUBU, default: null },
    respiration: { type: [String], enum: HEALTH_OPTIONS.SOLUNUM.hastaliklar, default: [] },
    heartCirculation: { type: [String], enum: HEALTH_OPTIONS.KALP_DOLASIM.hastaliklar, default: [] },
    metabolic: { type: [String], enum: HEALTH_OPTIONS.KANAMA_METABOLIK.hastaliklar, default: [] },
    allergies: { type: [String], enum: HEALTH_OPTIONS.ALERJILER.hastaliklar, default: [] },
    cancer: { type: [String], enum: HEALTH_OPTIONS.BAGISIKLIK_KANSER.hastaliklar, default: [] },
    neurological: { type: [String], enum: HEALTH_OPTIONS.NOROLOJIK_YUKSEK_RISK.hastaliklar, default: [] },
    medicalAddictions: { type: [String], enum: HEALTH_OPTIONS.TIBBI_BAGIMLILIK.hastaliklar, default: [] },
    movementDisorders: { type: [String], enum: HEALTH_OPTIONS.HAREKET_KISITI.hastaliklar, default: [] },

    // Yeni Eklenenler
    demographicRisk: {
      type: String,
      enum: Object.keys(DEMOGRAPHIC_RISK),
      default: [],
    },
    cognitiveCommunicationSensoryRisk: {
      type: [String],
      enum: BILISSEL_ILETISIM_DUYUSAL_RISK.hastaliklar,
      default: [],
    },

    weight: { type: Number },
    height: { type: Number },
    allowsNotifications: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hooks
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) { return next(err); }
  next();
});

userSchema.pre('save', function (next) {
  if (this.isModified('tcNumber')) {
    this.isVerified = !!(this.tcNumber && this.tcNumber.length === 11);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
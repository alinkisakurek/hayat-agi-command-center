const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { HEALTH_OPTIONS, GENDER_LABELS } = require('../utils/constants');

const Schema = mongoose.Schema;

const emergencyContactUserSchema = new Schema({
  fullname: { type: String, default: '', required: true, trim: true },
  phone: { type: String, default: '', required: true, trim: true },
  relation: { type: String, default: '', trim: true }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, trim: true },
    surname: { type: String, required: true, minlength: 2, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'citizen'], default: 'citizen' },

    // TC Kimlik Numarası
    tcNumber: {
      type: String,
      unique: true,
      sparse: true, // bazı kullanıcılar doldurmayabilir
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // boş ise geç
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

    phoneNumber: { type: String, default: null, trim: true },
    tokenVersion: { type: Number, default: 0 },

    emergencyContact: {
      type: emergencyContactUserSchema,
      default: () => ({})
    },

    birthDate: { type: Date, default: null },

    bloodType: {
      type: String,
      enum: HEALTH_OPTIONS.bloodGroups,
      default: null,
    },

    medicalConditions: {
      type: String,
      enum: HEALTH_OPTIONS.chronicConditions,
      default: [],
    },

    prosthetics: {
      type: String,
      enum: HEALTH_OPTIONS.prostheses,
      default: [],
    },

    medications: {
      type: String,
      enum: HEALTH_OPTIONS.medications,
      default: [],
    },

    gender: {
      type: String,
      enum: Object.keys(GENDER_LABELS),
      default: null,
    },
  },
  { timestamps: true }
);


// Hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);

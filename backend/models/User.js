const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'regional'], default: 'regional' },
    tokenVersion: { type: Number, default: 0 },
    
    // İletişim Bilgileri
    phoneNumber: { type: String, default: '' },
    emergencyContactName: { type: String, default: '' },
    emergencyContactPhone: { type: String, default: '' },
    emergencyContactRelation: { type: String, default: '' },
    
    // Sağlık Bilgileri
    bloodType: { 
      type: String, 
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-', ''], 
      default: '' 
    },
    medicalConditions: { type: String, default: '' },
    prosthetics: { type: String, default: '' },
    hasProsthesis: { type: Boolean, default: false },
    birthDate: { type: Date, default: null },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'prefer_not_to_say', ''], 
      default: '' 
    },
    medications: { type: String, default: '' },
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

// User (Admin/Regional) session and role management (simple stub)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/users/register
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashed, role: role || 'regional' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

// POST /api/users/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

// GET /api/users/me
async function me(req, res) {
  const user = req.user;
  res.json({ 
    _id: user._id, 
    name: user.name, 
    email: user.email, 
    role: user.role,
    phoneNumber: user.phoneNumber,
    emergencyContactName: user.emergencyContactName,
    emergencyContactPhone: user.emergencyContactPhone,
    emergencyContactRelation: user.emergencyContactRelation,
    bloodType: user.bloodType,
    medicalConditions: user.medicalConditions,
    prosthetics: user.prosthetics,
    hasProsthesis: user.hasProsthesis,
    birthDate: user.birthDate,
    gender: user.gender,
    medications: user.medications
  });
}

// PUT /api/users/profile - Profil bilgilerini güncelle
async function updateProfile(req, res, next) {
  try {
    const userId = req.user._id;
    const {
      phoneNumber,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      bloodType,
      medicalConditions,
      prosthetics,
      hasProsthesis,
      birthDate,
      gender,
      medications
    } = req.body;

    const updateData = {};
    
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (emergencyContactName !== undefined) updateData.emergencyContactName = emergencyContactName;
    if (emergencyContactPhone !== undefined) updateData.emergencyContactPhone = emergencyContactPhone;
    if (emergencyContactRelation !== undefined) updateData.emergencyContactRelation = emergencyContactRelation;
    if (bloodType !== undefined) updateData.bloodType = bloodType;
    if (medicalConditions !== undefined) updateData.medicalConditions = medicalConditions;
    if (prosthetics !== undefined) updateData.prosthetics = prosthetics;
    if (hasProsthesis !== undefined) updateData.hasProsthesis = hasProsthesis;
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
    if (gender !== undefined) updateData.gender = gender;
    if (medications !== undefined) updateData.medications = medications;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profil başarıyla güncellendi',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        emergencyContactName: updatedUser.emergencyContactName,
        emergencyContactPhone: updatedUser.emergencyContactPhone,
        emergencyContactRelation: updatedUser.emergencyContactRelation,
        bloodType: updatedUser.bloodType,
        medicalConditions: updatedUser.medicalConditions,
        prosthetics: updatedUser.prosthetics,
        hasProsthesis: updatedUser.hasProsthesis,
        birthDate: updatedUser.birthDate,
        gender: updatedUser.gender,
        medications: updatedUser.medications
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, updateProfile };

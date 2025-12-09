const express = require('express');
const router = express.Router();
const { 
  reportIssue, 
  getAllIssues, 
  getIssueById, 
  updateIssueStatus 
} = require('../controllers/issueController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Kullanıcı sorun bildir
router.post('/report', protect, reportIssue);

// Admin: Tüm sorunları listele
router.get('/all', protect, adminOnly, getAllIssues);

// Admin: Sorun detayını getir
router.get('/:id', protect, adminOnly, getIssueById);

// Admin: Sorun durumunu güncelle
router.put('/:id/status', protect, adminOnly, updateIssueStatus);

module.exports = router;


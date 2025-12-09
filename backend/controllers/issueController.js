const Issue = require('../models/Issue');
const User = require('../models/User');
const mongoose = require('mongoose');

// MongoDB bağlantısı olup olmadığını kontrol et
const isMongoDBConnected = () => mongoose.connection.readyState === 1;

// Kullanıcı sorun bildir
async function reportIssue(req, res, next) {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;

    console.log('Sorun bildirme isteği:', { title, description, userId });

    if (!title || !description) {
      return res.status(400).json({ 
        message: 'Başlık ve açıklama alanları zorunludur.' 
      });
    }

    if (!title.trim() || !description.trim()) {
      return res.status(400).json({ 
        message: 'Başlık ve açıklama alanları boş olamaz.' 
      });
    }

    const issue = new Issue({
      title: title.trim(),
      description: description.trim(),
      reportedBy: userId,
      status: 'pending'
    });

    await issue.save();
    console.log('Sorun kaydedildi:', issue._id);

    // Kullanıcı bilgilerini populate et
    await issue.populate('reportedBy', 'name email');

    res.status(201).json({
      message: 'Sorun başarıyla bildirildi',
      issue: {
        _id: issue._id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        reportedBy: {
          name: issue.reportedBy.name,
          email: issue.reportedBy.email
        },
        createdAt: issue.createdAt
      }
    });
  } catch (err) {
    console.error('Sorun bildirme hatası:', err);
    // Daha detaylı hata mesajı
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Geçersiz veri: ' + Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Geçersiz ID formatı'
      });
    }
    res.status(500).json({ 
      message: 'Sorun bildirilirken bir hata oluştu: ' + err.message 
    });
  }
}

// Admin: Tüm sorunları listele
async function getAllIssues(req, res, next) {
  try {
    const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    if (isMongoDBConnected()) {
      const query = {};
      if (status && ['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
        query.status = status;
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const issues = await Issue.find(query)
        .populate('reportedBy', 'name email phoneNumber')
        .sort(sortOptions)
        .lean();

      res.json({
        issues: issues.map(issue => ({
          _id: issue._id,
          title: issue.title,
          description: issue.description,
          status: issue.status,
          adminNotes: issue.adminNotes || '',
          reportedBy: issue.reportedBy ? {
            name: issue.reportedBy.name,
            email: issue.reportedBy.email,
            phoneNumber: issue.reportedBy.phoneNumber || ''
          } : { name: 'Bilinmeyen', email: 'N/A' },
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt
        }))
      });
    } else {
      // MongoDB bağlı değilse mock data döndür
      console.warn('MongoDB bağlı değil, mock sorunlar döndürülüyor.');
      const mockIssues = [
        {
          _id: 'mock1',
          title: 'Örnek Sorun 1',
          description: 'Bu bir örnek sorun bildirimidir. MongoDB bağlantısı kurulduğunda gerçek veriler görünecektir.',
          status: 'pending',
          adminNotes: '',
          reportedBy: {
            name: 'Örnek Kullanıcı',
            email: 'ornek@example.com',
            phoneNumber: ''
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      let filteredIssues = mockIssues;
      if (status && status !== 'all') {
        filteredIssues = mockIssues.filter(issue => issue.status === status);
      }

      res.json({ issues: filteredIssues });
    }
  } catch (err) {
    console.error('getAllIssues hatası:', err);
    next(err);
  }
}

// Admin: Sorun detayını getir
async function getIssueById(req, res, next) {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      const issue = await Issue.findById(id)
        .populate('reportedBy', 'name email phoneNumber');

      if (!issue) {
        return res.status(404).json({ message: 'Sorun bulunamadı' });
      }

      res.json({
        issue: {
          _id: issue._id,
          title: issue.title,
          description: issue.description,
          status: issue.status,
          adminNotes: issue.adminNotes || '',
          reportedBy: issue.reportedBy ? {
            _id: issue.reportedBy._id,
            name: issue.reportedBy.name,
            email: issue.reportedBy.email,
            phoneNumber: issue.reportedBy.phoneNumber || ''
          } : { name: 'Bilinmeyen', email: 'N/A' },
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt
        }
      });
    } else {
      // MongoDB bağlı değilse mock data döndür
      res.json({
        issue: {
          _id: id,
          title: 'Örnek Sorun',
          description: 'MongoDB bağlantısı kurulduğunda gerçek veriler görünecektir.',
          status: 'pending',
          adminNotes: '',
          reportedBy: {
            _id: 'mock_user',
            name: 'Örnek Kullanıcı',
            email: 'ornek@example.com',
            phoneNumber: ''
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
  } catch (err) {
    console.error('getIssueById hatası:', err);
    next(err);
  }
}

// Admin: Sorun durumunu güncelle
async function updateIssueStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status || !['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ 
        message: 'Geçerli bir durum belirtilmelidir.' 
      });
    }

    const updateData = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes.trim();
    }

    const issue = await Issue.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Sorun bulunamadı' });
    }

    res.json({
      message: 'Sorun durumu güncellendi',
      issue: {
        _id: issue._id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        adminNotes: issue.adminNotes || '',
        reportedBy: {
          name: issue.reportedBy.name,
          email: issue.reportedBy.email
        },
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  reportIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus
};


const mongoose = require('mongoose');
const path = require('path');
// .env dosyasını bir üst klasörden bul
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const User = require('../models/User');

async function run() {
    // 1. Bağlantı Kontrolü
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI bulunamadı! .env dosyanı kontrol et.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB bağlantısı kuruldu.');
    } catch (err) {
        console.error('❌ Bağlantı hatası:', err.message);
        process.exit(1);
    }

    // 2. Admin Kontrolü
    const email = 'user@hayatagi.com';
    const exists = await User.findOne({ email });

    if (exists) {
        console.log('⚠️  Admin zaten mevcut. İşlem yapılmadı.');
        process.exit(0);
    }

    // 3. Yeni Admin Oluşturma (Sadece temel bilgiler yeterli)
    const religionalUser = new User({
        name: 'Bolge',
        surname: 'Kullanici',
        email: email,
        password: '123456', // Modeldeki pre-save bunu otomatik hashleyecek
        role: 'citizen',
        tcNumber: '10000000146'
    });

    try {
        await religionalUser.save();
        console.log('🎉 Religional başarıyla oluşturuldu:', email);
    } catch (error) {
        console.error('❌ Religional oluşturma hatası:', error.message);
    }

    process.exit(0);
}

run();
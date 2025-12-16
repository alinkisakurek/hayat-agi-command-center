const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI not set — skipping MongoDB connection (development mode)');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // In development we don't exit the process; let app run even without DB.
    }
};

module.exports = connectDB;
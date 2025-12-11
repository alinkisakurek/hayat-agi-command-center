// Setup script for Alert collection: ensures indexes and optionally seeds sample data
const path = require('path');
const mongoose = require('mongoose');
const { loadEnv } = require('../config/index');
const connectDB = require('../config/db');

async function main() {
  // Load env from backend/.env
  loadEnv();

  const args = process.argv.slice(2);
  const shouldSeed = args.includes('--seed');

  await connectDB();

  const Alert = require('../models/Alert');

  try {
    // Ensure indexes
    await Alert.createIndexes();
    console.log('Alert indexes ensured successfully.');

    if (shouldSeed) {
      const now = new Date();
      const seedDocs = [
        {
          device_id: 'device-001',
          type: 'sos',
          status: 'open',
          battery: 42,
          signal_quality: 'medium',
          location: { lat: 39.9208, lng: 32.8541 },
          payload: { source: 'simulated' },
          createdAt: now,
          updatedAt: now,
        },
        {
          device_id: 'device-002',
          type: 'low_battery',
          status: 'acknowledged',
          battery: 15,
          signal_quality: 'weak',
          payload: { threshold: 20 },
          acknowledged_at: now,
          createdAt: now,
          updatedAt: now,
        },
        {
          device_id: 'device-003',
          type: 'crash_detection',
          status: 'resolved',
          battery: 88,
          signal_quality: 'strong',
          notes: 'Auto-resolved after false positive check',
          resolved_at: now,
          createdAt: now,
          updatedAt: now,
        },
      ];

      const res = await Alert.insertMany(seedDocs, { ordered: false });
      console.log(`Seeded ${res.length} alert documents.`);
    }

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error during Alert setup:', err.message);
    process.exit(1);
  } finally {
    try { await mongoose.connection.close(); } catch (_) {}
  }
}

main();

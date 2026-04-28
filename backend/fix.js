const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Drop all indexes on movies collection (except _id)
    try {
      await db.collection('movies').dropIndexes();
      console.log('✅ Dropped all movie indexes');
    } catch (e) {
      console.log('⚠️  Could not drop movie indexes:', e.message);
    }

    // Drop all indexes on news collection (except _id)
    try {
      await db.collection('news').dropIndexes();
      console.log('✅ Dropped all news indexes');
    } catch (e) {
      console.log('⚠️  Could not drop news indexes:', e.message);
    }

    console.log('\n✅ Done! Restart your server to recreate correct indexes.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixIndexes();
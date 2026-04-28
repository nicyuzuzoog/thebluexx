const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const fixMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const Movie = mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

    // Find all movies with maxresdefault
    const movies = await Movie.find({
      $or: [
        { poster: { $regex: 'maxresdefault' } },
        { backdrop: { $regex: 'maxresdefault' } }
      ]
    });

    console.log(`Found ${movies.length} movies to fix`);

    for (const movie of movies) {
      const updates = {};

      if (movie.poster && movie.poster.includes('maxresdefault')) {
        updates.poster = movie.poster.replace('maxresdefault', 'hqdefault');
      }

      if (movie.backdrop && movie.backdrop.includes('maxresdefault')) {
        updates.backdrop = movie.backdrop.replace('maxresdefault', 'hqdefault');
      }

      if (Object.keys(updates).length > 0) {
        await Movie.updateOne({ _id: movie._id }, { $set: updates });
        console.log(`Fixed: ${movie.title?.en || movie._id}`);
      }
    }

    // Also fix any future timestamps
    const futureMovies = await Movie.find({
      createdAt: { $gt: new Date() }
    });

    if (futureMovies.length > 0) {
      console.log(`\nFound ${futureMovies.length} movies with future dates, fixing...`);
      for (const movie of futureMovies) {
        await Movie.updateOne(
          { _id: movie._id },
          {
            $set: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        );
        console.log(`Fixed date: ${movie.title?.en || movie._id}`);
      }
    }

    console.log('\n✅ All movies fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixMovies();
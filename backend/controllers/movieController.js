const Movie = require('../models/Movie');
const {
  getPagination, extractYouTubeId,
  getYouTubeThumbnail, deleteFromCloudinary
} = require('../utils/helpers');

exports.getMovies = async (req, res) => {
  try {
    const { page, limit, genre, search, sort, featured } = req.query;
    const { pageNum, limitNum, skip } = getPagination(page, limit);

    let query = { status: 'published' };
    if (genre) query.genre = { $in: [genre] };
    if (featured === 'true') query.isFeatured = true;
    if (search) query.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === 'views') sortOption = { views: -1 };
    if (sort === 'likes') sortOption = { likesCount: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .populate('addedBy', 'name avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      success: true, data: movies,
      pagination: {
        page: pageNum, limit: limitNum,
        total, pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMovieBySlug = async (req, res) => {
  try {
    const movie = await Movie.findOne({
      slug: req.params.slug,
      status: 'published'
    })
      .populate('addedBy', 'name avatar')
      .populate({
        path: 'comments',
        match: { isApproved: true, parentComment: null },
        options: { sort: { createdAt: -1 }, limit: 20 },
        populate: {
          path: 'replies',
          match: { isApproved: true },
          options: { sort: { createdAt: 1 } }
        }
      });

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    movie.views += 1;
    await movie.save();

    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      addedBy: req.user.id,
      status: req.user.role === 'admin' ? 'published' : 'pending'
    };

    if (req.body.titleEn) {
      movieData.title = {
        en: req.body.titleEn,
        fr: req.body.titleFr || '',
        rw: req.body.titleRw || ''
      };
    }
    if (req.body.descriptionEn) {
      movieData.description = {
        en: req.body.descriptionEn,
        fr: req.body.descriptionFr || '',
        rw: req.body.descriptionRw || ''
      };
    }

    if (req.body.genre && typeof req.body.genre === 'string') {
      movieData.genre = req.body.genre.split(',').map(g => g.trim()).filter(Boolean);
    }
    if (req.body.cast && typeof req.body.cast === 'string') {
      movieData.cast = req.body.cast.split(',').map(c => c.trim()).filter(Boolean);
    }

    // If poster uploaded to Cloudinary
    if (req.file) {
      movieData.poster = req.file.path;
      movieData.backdrop = req.file.path;
    } else if (req.body.trailerUrl) {
      // Use YouTube thumbnail as poster
      const ytId = extractYouTubeId(req.body.trailerUrl);
      if (ytId) {
        movieData.poster = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        movieData.backdrop = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }

    const movie = await Movie.create(movieData);
    await movie.populate('addedBy', 'name avatar');

    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    if (movie.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.file) {
      // Delete old poster from Cloudinary
      if (movie.poster && movie.poster.includes('cloudinary.com')) {
        await deleteFromCloudinary(movie.poster);
      }
      req.body.poster = req.file.path;
    }

    if (req.body.titleEn) {
      req.body.title = {
        en: req.body.titleEn,
        fr: req.body.titleFr || movie.title.fr,
        rw: req.body.titleRw || movie.title.rw
      };
    }
    if (req.body.descriptionEn) {
      req.body.description = {
        en: req.body.descriptionEn,
        fr: req.body.descriptionFr || movie.description.fr,
        rw: req.body.descriptionRw || movie.description.rw
      };
    }

    if (req.body.genre && typeof req.body.genre === 'string') {
      req.body.genre = req.body.genre.split(',').map(g => g.trim()).filter(Boolean);
    }
    if (req.body.cast && typeof req.body.cast === 'string') {
      req.body.cast = req.body.cast.split(',').map(c => c.trim()).filter(Boolean);
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('addedBy', 'name avatar');

    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    if (movie.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete poster from Cloudinary
    if (movie.poster && movie.poster.includes('cloudinary.com')) {
      await deleteFromCloudinary(movie.poster);
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likeMovie = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    const existingLike = movie.likes.find(l => l.email === email);
    if (existingLike) {
      movie.likes = movie.likes.filter(l => l.email !== email);
      movie.likesCount = Math.max(0, movie.likesCount - 1);
    } else {
      movie.likes.push({ email });
      movie.likesCount += 1;
    }
    await movie.save();
    res.json({ success: true, liked: !existingLike, likesCount: movie.likesCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.trackDownload = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({
      success: true,
      downloadUrl: movie.downloadUrl,
      downloads: movie.downloads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.shareMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );
    res.json({ success: true, shares: movie.shares });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
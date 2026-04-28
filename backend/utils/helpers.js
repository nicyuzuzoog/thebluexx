const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories
const dirs = ['uploads', 'uploads/news', 'uploads/movies', 'uploads/ads', 'uploads/avatars', 'uploads/stories'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    if (req.baseUrl.includes('news')) uploadPath = 'uploads/news/';
    else if (req.baseUrl.includes('movies')) uploadPath = 'uploads/movies/';
    else if (req.baseUrl.includes('ads')) uploadPath = 'uploads/ads/';
    else if (req.baseUrl.includes('stories')) uploadPath = 'uploads/stories/';
    else if (req.baseUrl.includes('auth')) uploadPath = 'uploads/avatars/';
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const extractYouTubeId = (url) => {
  if (!url) return null;

  // Handle youtu.be/ID?si=xxx format
  // Handle youtube.com/watch?v=ID format
  // Handle youtube.com/embed/ID format
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Pagination helper
const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

module.exports = { upload, extractYouTubeId, getPagination };
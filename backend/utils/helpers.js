const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Create upload directories ───
const dirs = [
  'uploads',
  'uploads/news',
  'uploads/movies',
  'uploads/ads',
  'uploads/avatars',
  'uploads/stories'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ─── Storage configuration ───
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';

    if (req.baseUrl.includes('news'))    uploadPath = 'uploads/news/';
    else if (req.baseUrl.includes('movies'))  uploadPath = 'uploads/movies/';
    else if (req.baseUrl.includes('ads'))     uploadPath = 'uploads/ads/';
    else if (req.baseUrl.includes('stories')) uploadPath = 'uploads/stories/';
    else if (req.baseUrl.includes('auth'))    uploadPath = 'uploads/avatars/';

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ─── File filter ───
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// ─── Multer upload ───
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ─── Extract YouTube Video ID ───
const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ─── Get YouTube thumbnail URL ───
const getYouTubeThumbnail = (url, quality = 'hq') => {
  const id = extractYouTubeId(url);
  if (!id) return '';

  const qualities = {
    max:     `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    sd:      `https://img.youtube.com/vi/${id}/sddefault.jpg`,
    hq:      `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    mq:      `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
    default: `https://img.youtube.com/vi/${id}/0.jpg`,
  };

  return qualities[quality] || qualities.hq;
};

// ─── Pagination helper ───
const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

// ─── Format number ───
const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// ─── Truncate text ───
const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// ─── Get localized text ───
const getLocalizedText = (textObj, lang = 'en') => {
  if (!textObj) return '';
  if (typeof textObj === 'string') return textObj;
  return textObj[lang] || textObj.en || textObj.fr || textObj.rw || '';
};

// ─── Slugify text ───
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// ─── Validate email ───
const isValidEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// ─── Time ago ───
const timeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;

  return past.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// ─── Generate random string ───
const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ─── Sanitize string ───
const sanitizeString = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// ─── Check if string is URL ───
const isUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// ─── Get file extension ───
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase().replace('.', '');
};

// ─── Calculate read time ───
const calculateReadTime = (text) => {
  if (!text) return '1 min read';
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

module.exports = {
  upload,
  extractYouTubeId,
  getYouTubeThumbnail,
  getPagination,
  formatNumber,
  truncateText,
  getLocalizedText,
  slugify,
  isValidEmail,
  timeAgo,
  generateRandomString,
  sanitizeString,
  isUrl,
  getFileExtension,
  calculateReadTime
};
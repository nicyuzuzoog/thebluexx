const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// ─── Cloudinary Storage for each folder ───
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      // Determine folder based on route
      let uploadFolder = 'thebluex/general';

      if (folder) {
        uploadFolder = `thebluex/${folder}`;
      } else if (req.baseUrl.includes('news')) {
        uploadFolder = 'thebluex/news';
      } else if (req.baseUrl.includes('movies')) {
        uploadFolder = 'thebluex/movies';
      } else if (req.baseUrl.includes('ads')) {
        uploadFolder = 'thebluex/ads';
      } else if (req.baseUrl.includes('stories')) {
        uploadFolder = 'thebluex/stories';
      } else if (req.baseUrl.includes('auth')) {
        uploadFolder = 'thebluex/avatars';
      }

      return {
        folder: uploadFolder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'auto'
          }
        ],
        public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      };
    }
  });
};

// ─── File filter ───
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed! (jpg, png, gif, webp, svg)'), false);
  }
};

// ─── Main upload middleware (auto-detects folder from route) ───
const upload = multer({
  storage: createCloudinaryStorage(null),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ─── Specific upload middlewares for each type ───
const uploadNews = multer({
  storage: createCloudinaryStorage('news'),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadMovies = multer({
  storage: createCloudinaryStorage('movies'),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadAds = multer({
  storage: createCloudinaryStorage('ads'),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadAvatars = multer({
  storage: createCloudinaryStorage('avatars'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB for avatars
});

const uploadStories = multer({
  storage: createCloudinaryStorage('stories'),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ─── Delete image from Cloudinary ───
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Only delete Cloudinary images
    if (!imageUrl.includes('cloudinary.com')) return;

    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/filename.jpg
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');

    if (uploadIndex === -1) return;

    // Get everything after 'upload/v{version}/'
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
    // Remove file extension
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');

    await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error.message);
  }
};

// ─── Upload image from URL to Cloudinary ───
const uploadFromUrl = async (url, folder = 'thebluex/general') => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    });
    return result.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary upload from URL error:', error.message);
    return url; // Return original URL if upload fails
  }
};

// ─── Get optimized image URL from Cloudinary ───
const getOptimizedUrl = (cloudinaryUrl, options = {}) => {
  if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) {
    return cloudinaryUrl;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  // Build transformation string
  let transforms = `q_${quality},f_${format}`;
  if (width) transforms += `,w_${width}`;
  if (height) transforms += `,h_${height}`;
  if (width || height) transforms += `,c_${crop}`;

  // Insert transformation into URL
  return cloudinaryUrl.replace('/upload/', `/upload/${transforms}/`);
};

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

// ─── Validate email ───
const isValidEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// ─── Slugify ───
const slugifyText = (text) => {
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

// ─── Calculate read time ───
const calculateReadTime = (text) => {
  if (!text) return '1 min read';
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

module.exports = {
  // Upload middlewares
  upload,
  uploadNews,
  uploadMovies,
  uploadAds,
  uploadAvatars,
  uploadStories,

  // Cloudinary helpers
  deleteFromCloudinary,
  uploadFromUrl,
  getOptimizedUrl,
  cloudinary,

  // General helpers
  extractYouTubeId,
  getYouTubeThumbnail,
  getPagination,
  formatNumber,
  truncateText,
  getLocalizedText,
  timeAgo,
  isValidEmail,
  slugifyText,
  calculateReadTime
};
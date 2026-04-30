// ─── Image URL Helper ───
export const getImageUrl = (path) => {
  if (!path) return '';

  // Already a full URL (Cloudinary, YouTube, external)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Data URI (placeholder)
  if (path.startsWith('data:')) {
    return path;
  }

  // Legacy local upload path (old data before Cloudinary)
  const apiBase = import.meta.env.VITE_API_URL || '/api';
  const serverBase = apiBase.replace(/\/api\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${serverBase}${cleanPath}`;
};

// ─── Cloudinary Optimized Image ───
export const getOptimizedImage = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return getImageUrl(url);

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  let transforms = `q_${quality},f_${format}`;
  if (width) transforms += `,w_${width}`;
  if (height) transforms += `,h_${height}`;
  if (width || height) transforms += `,c_${crop}`;

  return url.replace('/upload/', `/upload/${transforms}/`);
};

// ─── Date Formatting ───
export const formatDate = (date, lang = 'en') => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const localeMap = { en: 'en-US', fr: 'fr-FR', rw: 'rw-RW' };
  return new Date(date).toLocaleDateString(localeMap[lang] || 'en-US', options);
};

// ─── Number Formatting ───
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// ─── Localized Text ───
export const getLocalizedText = (textObj, lang = 'en') => {
  if (!textObj) return '';
  if (typeof textObj === 'string') return textObj;
  return textObj[lang] || textObj.en || textObj.fr || textObj.rw || '';
};

// ─── YouTube ID Extractor ───
export const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ─── YouTube Thumbnail ───
export const getYouTubeThumbnail = (url, quality = 'hq') => {
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

// ─── YouTube Thumbnail Fallbacks ───
export const getYouTubeThumbnails = (url) => {
  const id = extractYouTubeId(url);
  if (!id) return [];
  return [
    `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${id}/0.jpg`,
  ];
};

// ─── Get Poster Data for Movies (with fallbacks) ───
export const getMoviePosterData = (movie) => {
  if (
    movie.poster &&
    !movie.poster.includes('youtube') &&
    !movie.poster.includes('img.youtube')
  ) {
    return { src: getImageUrl(movie.poster), fallbacks: [] };
  }

  const ytId = extractYouTubeId(movie.trailerUrl);
  if (ytId) {
    return {
      src: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      fallbacks: [
        `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`,
        `https://img.youtube.com/vi/${ytId}/0.jpg`,
      ]
    };
  }

  return { src: '', fallbacks: [] };
};

// ─── Text Truncation ───
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// ─── Share URLs ───
export const getShareUrl = (platform, url, title) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'instagram':
      return `https://www.instagram.com/`;
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    default:
      return url;
  }
};

// ─── Time Ago ───
export const timeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  return formatDate(date);
};

// ─── Category Colors ───
export const categoryColors = {
  announcements: '#1B4FFF',
  news:          '#00C26F',
  ideas:         '#F59E0B',
  stories:       '#7C3AED',
  jobs:          '#E5344A',
  technology:    '#0EA5E9',
  sports:        '#10B981',
  entertainment: '#EC4899',
  politics:      '#EF4444',
  business:      '#0369A1',
  health:        '#14B8A6',
  education:     '#6D28D9',
  culture:       '#EA580C',
  other:         '#627490'
};

// ─── Category Backgrounds ───
export const categoryBgs = {
  announcements: 'rgba(27,79,255,0.08)',
  news:          'rgba(0,194,111,0.08)',
  ideas:         'rgba(245,158,11,0.08)',
  stories:       'rgba(124,58,237,0.08)',
  jobs:          'rgba(229,52,74,0.08)',
  technology:    'rgba(14,165,233,0.08)',
  sports:        'rgba(16,185,129,0.08)',
  entertainment: 'rgba(236,72,153,0.08)',
  politics:      'rgba(239,68,68,0.08)',
  business:      'rgba(3,105,161,0.08)',
  health:        'rgba(20,184,166,0.08)',
  education:     'rgba(109,40,217,0.08)',
  culture:       'rgba(234,88,12,0.08)',
  other:         'rgba(98,116,144,0.08)'
};

// ─── Get Category Style ───
export const getCategoryStyle = (category) => ({
  color: categoryColors[category] || categoryColors.other,
  background: categoryBgs[category] || categoryBgs.other,
});

// ─── Slugify ───
export const slugify = (text) => {
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

// ─── Validate Email ───
export const isValidEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// ─── Calculate Read Time ───
export const calculateReadTime = (text) => {
  if (!text) return '1 min read';
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// ─── Copy to Clipboard ───
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
};

// ─── Generate Avatar Initials ───
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// ─── Debounce ───
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ─── Check if mobile ───
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// ─── Format file size ───
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ─── Get contrast color (black or white) for any background ───
export const getContrastColor = (hexColor) => {
  if (!hexColor) return '#000000';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// ─── Build query string ───
export const buildQueryString = (params) => {
  const filtered = Object.entries(params)
    .filter(([, value]) => value !== '' && value !== null && value !== undefined);
  return filtered.length > 0
    ? '?' + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    : '';
};

// ─── Check if URL is YouTube ───
export const isYouTubeUrl = (url) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// ─── Check if URL is Cloudinary ───
export const isCloudinaryUrl = (url) => {
  if (!url) return false;
  return url.includes('cloudinary.com');
};

// ─── Get page title ───
export const getPageTitle = (title) => {
  return title ? `${title} — THE BLUEX` : 'THE BLUEX — Rwanda\'s Premier Digital Platform';
};

// ─── Local Storage helpers ───
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// ─── User email/name from localStorage ───
export const getUserInfo = () => ({
  email: localStorage.getItem('bluex_user_email') || '',
  name: localStorage.getItem('bluex_user_name') || '',
});

export const setUserInfo = (email, name) => {
  if (email) localStorage.setItem('bluex_user_email', email);
  if (name) localStorage.setItem('bluex_user_name', name);
};
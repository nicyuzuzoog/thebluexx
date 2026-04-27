export const formatDate = (date, lang = 'en') => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const localeMap = { en: 'en-US', fr: 'fr-FR', rw: 'rw-RW' };
  return new Date(date).toLocaleDateString(localeMap[lang] || 'en-US', options);
};

export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const getLocalizedText = (textObj, lang = 'en') => {
  if (!textObj) return '';
  if (typeof textObj === 'string') return textObj;
  return textObj[lang] || textObj.en || textObj.fr || textObj.rw || '';
};

export const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getYouTubeThumbnail = (url) => {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

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

export const timeAgo = (date) => {
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

export const categoryColors = {
  announcements: '#0066cc',
  news: '#00994d',
  ideas: '#ff6600',
  stories: '#9933cc',
  jobs: '#cc0066',
  technology: '#0099cc',
  sports: '#33cc33',
  entertainment: '#ff3399',
  politics: '#cc3300',
  business: '#006699',
  health: '#00cc99',
  education: '#6633cc',
  culture: '#cc6600',
  other: '#666666'
};
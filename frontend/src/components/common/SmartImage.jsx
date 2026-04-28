import { useState, useCallback } from 'react';

const PLACEHOLDER = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#1A2332"/>
  <rect x="155" y="95" width="90" height="70" rx="8" fill="#263042" opacity="0.8"/>
  <polygon points="178,112 178,148 208,130" fill="#3D4F68"/>
  <text x="200" y="205" text-anchor="middle" fill="#3D4F68" font-size="12" font-family="system-ui">THE BLUEX</text>
</svg>
`)}`;

const SmartImage = ({
  src,
  fallbackSrcs = [],
  alt = '',
  style = {},
  className = '',
  ...props
}) => {
  const allSources = [src, ...fallbackSrcs].filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const handleError = useCallback(() => {
    if (currentIndex < allSources.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setAllFailed(true);
    }
  }, [currentIndex, allSources.length]);

  const currentSrc = allFailed
    ? PLACEHOLDER
    : allSources[currentIndex] || PLACEHOLDER;

  return (
    <img
      src={currentSrc}
      alt={alt}
      style={style}
      className={className}
      onError={handleError}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default SmartImage;
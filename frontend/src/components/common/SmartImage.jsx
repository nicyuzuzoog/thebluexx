import { useState } from 'react';

const PLACEHOLDER = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#1C2434"/>
  <rect x="150" y="90" width="100" height="80" rx="8" fill="#2D3A50" opacity="0.8"/>
  <polygon points="175,110 175,150 210,130" fill="#4A5568"/>
  <text x="200" y="210" text-anchor="middle" fill="#4A5568" font-size="13" font-family="sans-serif">THE BLUEX</text>
  <text x="200" y="230" text-anchor="middle" fill="#2D3A50" font-size="11" font-family="sans-serif">No Image Available</text>
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
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (index < allSources.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      setFailed(true);
    }
  };

  return (
    <img
      src={failed ? PLACEHOLDER : (allSources[index] || PLACEHOLDER)}
      alt={alt}
      style={style}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

export default SmartImage;
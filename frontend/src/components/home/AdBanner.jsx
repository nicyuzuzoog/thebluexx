import { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdBanner = ({ position = 'top-banner' }) => {
  const [ads, setAds] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/ads?position=${position}`);
        setAds(res.data.data);
      } catch (e) { /* silent */ }
    };
    fetch();
  }, [position]);

  useEffect(() => {
    if (ads.length > 1) {
      const iv = setInterval(() => setCurrent(p => (p + 1) % ads.length), 8000);
      return () => clearInterval(iv);
    }
  }, [ads]);

  const handleClick = async (ad) => {
    try { await api.post(`/ads/${ad._id}/click`); } catch (e) { /* */ }
    if (ad.link) window.open(ad.link, '_blank');
  };

  if (ads.length === 0) return null;

  const ad = ads[current];

  return (
    <div className="ad-banner" onClick={() => handleClick(ad)}
      style={{ margin: '18px 0' }}>
      <img src={ad.image} alt={ad.title} loading="lazy" />
      <span className="ad-banner-label">AD</span>
      {ads.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '8px', left: '50%',
          transform: 'translateX(-50%)', display: 'flex', gap: '5px'
        }}>
          {ads.map((_, i) => (
            <button key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              style={{
                width: i === current ? '18px' : '7px',
                height: '7px',
                borderRadius: '4px',
                background: i === current ? 'var(--white)' : 'rgba(255,255,255,0.38)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--dur-mid) var(--ease-out)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdBanner;
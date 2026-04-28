import { useState, useEffect, useRef } from 'react';
import { IoClose, IoVolumeOff } from 'react-icons/io5';
import api from '../../utils/api';

const AdBanner = ({ position = 'top-banner' }) => {
  const [ads, setAds] = useState([]);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    fetchAds();
  }, [position]);

  useEffect(() => {
    if (ads.length > 1) {
      const iv = setInterval(() => setCurrent(p => (p + 1) % ads.length), 10000);
      return () => clearInterval(iv);
    }
  }, [ads]);

  // Intersection observer for scroll-triggered ads
  useEffect(() => {
    if (!bannerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, [ads]);

  // Show floating ad after delay
  useEffect(() => {
    if (position === 'floating' || position === 'sidebar') {
      const timer = setTimeout(() => setShowFloating(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [position]);

  const fetchAds = async () => {
    try {
      const res = await api.get(`/ads?position=${position}`);
      setAds(res.data.data);
    } catch (e) { /* silent */ }
  };

  const handleClick = async (ad) => {
    try { await api.post(`/ads/${ad._id}/click`); } catch (e) { /* */ }
    if (ad.link) window.open(ad.link, '_blank');
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setDismissed(true);
  };

  if (ads.length === 0 || dismissed) return null;

  const ad = ads[current];

  // ─── SLIM TOP BANNER ───
  if (position === 'top-banner') {
    return (
      <div className="ad-slim" ref={bannerRef} onClick={() => handleClick(ad)}>
        <div className="container ad-slim-inner">
          <div className="ad-slim-content">
            <span className="ad-slim-badge">AD</span>
            <div className="ad-slim-img-wrap">
              <img src={ad.image} alt={ad.title} className="ad-slim-img" />
            </div>
            <div className="ad-slim-text">
              <span className="ad-slim-title">{ad.title}</span>
              <span className="ad-slim-cta">Learn More →</span>
            </div>
          </div>
          <button className="ad-slim-close" onClick={handleDismiss}
            title="Dismiss">
            <IoClose />
          </button>
        </div>

        <style>{`
          .ad-slim {
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border-soft);
            cursor: pointer;
            transition: background var(--dur-fast) var(--ease-out);
            overflow: hidden;
            animation: slideDown 0.4s var(--ease-out) both;
          }
          .ad-slim:hover {
            background: var(--grad-card-hover);
          }
          .ad-slim-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            gap: 12px;
          }
          .ad-slim-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            overflow: hidden;
          }
          .ad-slim-badge {
            font-family: var(--font-display);
            font-size: 0.58rem;
            font-weight: 800;
            color: var(--text-faint);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 2px 6px;
            border: 1px solid var(--border-soft);
            border-radius: var(--r-xs);
            flex-shrink: 0;
          }
          .ad-slim-img-wrap {
            width: 42px;
            height: 28px;
            border-radius: var(--r-sm);
            overflow: hidden;
            flex-shrink: 0;
            border: 1px solid var(--border-soft);
          }
          .ad-slim-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .ad-slim-text {
            display: flex;
            align-items: center;
            gap: 10px;
            overflow: hidden;
          }
          .ad-slim-title {
            font-family: var(--font-display);
            font-size: 0.82rem;
            font-weight: 600;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: -0.01em;
          }
          .ad-slim-cta {
            font-family: var(--font-display);
            font-size: 0.74rem;
            font-weight: 600;
            color: var(--cobalt);
            white-space: nowrap;
            flex-shrink: 0;
            transition: color var(--dur-fast);
          }
          .ad-slim:hover .ad-slim-cta { color: var(--jade); }
          .ad-slim-close {
            width: 26px; height: 26px;
            border-radius: 50%;
            background: var(--bg-overlay);
            color: var(--text-muted);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
            cursor: pointer;
            flex-shrink: 0;
            transition: all var(--dur-fast) var(--ease-out);
          }
          .ad-slim-close:hover {
            background: var(--crimson);
            color: var(--white);
            transform: rotate(90deg);
          }

          @media (max-width: 640px) {
            .ad-slim-cta { display: none; }
          }
        `}</style>
      </div>
    );
  }

  // ─── IN-FEED NATIVE AD ───
  if (position === 'in-feed') {
    return (
      <div className="ad-native" ref={bannerRef}
        onClick={() => handleClick(ad)}
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(12px)' }}>
        <div className="ad-native-inner">
          <span className="ad-native-label">Sponsored</span>
          <button className="ad-native-close" onClick={handleDismiss}>
            <IoClose />
          </button>
        </div>
        <div className="ad-native-body">
          <div className="ad-native-img-wrap">
            <img src={ad.image} alt={ad.title} className="ad-native-img" />
          </div>
          <div className="ad-native-info">
            <h4 className="ad-native-title">{ad.title}</h4>
            <span className="ad-native-cta">
              Learn More
              <span className="ad-native-cta-arrow">→</span>
            </span>
          </div>
        </div>

        {/* Progress dots */}
        {ads.length > 1 && (
          <div className="ad-native-dots">
            {ads.map((_, i) => (
              <button key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`ad-native-dot ${i === current ? 'active' : ''}`}
              />
            ))}
          </div>
        )}

        <style>{`
          .ad-native {
            background: var(--bg-surface);
            border: 1px solid var(--border-soft);
            border-radius: var(--r-lg);
            padding: 14px;
            margin: 22px 0;
            cursor: pointer;
            transition: all 0.5s var(--ease-out);
            position: relative;
          }
          .ad-native:hover {
            border-color: rgba(27,79,255,0.12);
            box-shadow: var(--shadow-sm);
          }

          .ad-native-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .ad-native-label {
            font-family: var(--font-display);
            font-size: 0.6rem;
            font-weight: 700;
            color: var(--text-faint);
            text-transform: uppercase;
            letter-spacing: 0.12em;
            padding: 2px 8px;
            border: 1px solid var(--border-soft);
            border-radius: var(--r-xs);
          }
          .ad-native-close {
            width: 24px; height: 24px;
            border-radius: 50%;
            background: transparent;
            color: var(--text-faint);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.82rem;
            cursor: pointer;
            transition: all var(--dur-fast) var(--ease-out);
            opacity: 0;
          }
          .ad-native:hover .ad-native-close { opacity: 1; }
          .ad-native-close:hover {
            background: var(--bg-overlay);
            color: var(--crimson);
          }

          .ad-native-body {
            display: flex;
            gap: 14px;
            align-items: center;
          }
          .ad-native-img-wrap {
            width: 72px; height: 54px;
            border-radius: var(--r-md);
            overflow: hidden;
            flex-shrink: 0;
            border: 1px solid var(--border-soft);
          }
          .ad-native-img {
            width: 100%; height: 100%;
            object-fit: cover;
            transition: transform var(--dur-slow) var(--ease-out);
          }
          .ad-native:hover .ad-native-img {
            transform: scale(1.06);
          }

          .ad-native-info { flex: 1; overflow: hidden; }
          .ad-native-title {
            font-family: var(--font-display);
            font-size: 0.88rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            letter-spacing: -0.01em;
            transition: color var(--dur-fast);
          }
          .ad-native:hover .ad-native-title { color: var(--cobalt); }

          .ad-native-cta {
            font-family: var(--font-display);
            font-size: 0.74rem;
            font-weight: 600;
            color: var(--cobalt);
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }
          .ad-native-cta-arrow {
            transition: transform var(--dur-fast) var(--ease-out);
            display: inline-block;
          }
          .ad-native:hover .ad-native-cta-arrow {
            transform: translateX(3px);
          }

          .ad-native-dots {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin-top: 10px;
          }
          .ad-native-dot {
            width: 6px; height: 6px;
            border-radius: 50%;
            background: var(--border-sharp);
            border: none;
            cursor: pointer;
            padding: 0;
            transition: all var(--dur-fast) var(--ease-out);
          }
          .ad-native-dot.active {
            width: 16px;
            border-radius: 3px;
            background: var(--cobalt);
          }

          @media (max-width: 640px) {
            .ad-native { padding: 10px; margin: 14px 0; }
            .ad-native-img-wrap { width: 56px; height: 42px; }
            .ad-native-title { font-size: 0.82rem; }
          }
        `}</style>
      </div>
    );
  }

  // ─── SIDEBAR AD (Small card) ───
  if (position === 'sidebar') {
    return (
      <div className="ad-sidebar-card" ref={bannerRef}
        onClick={() => handleClick(ad)}>
        <div className="ad-sidebar-header">
          <span className="ad-sidebar-label">Sponsored</span>
          <button className="ad-sidebar-close" onClick={handleDismiss}>
            <IoClose />
          </button>
        </div>
        <div className="ad-sidebar-img-wrap">
          <img src={ad.image} alt={ad.title} />
        </div>
        <div className="ad-sidebar-info">
          <h4 className="ad-sidebar-title">{ad.title}</h4>
          <span className="ad-sidebar-cta">Learn More →</span>
        </div>

        <style>{`
          .ad-sidebar-card {
            background: var(--bg-surface);
            border: 1px solid var(--border-soft);
            border-radius: var(--r-lg);
            overflow: hidden;
            cursor: pointer;
            transition: all var(--dur-mid) var(--ease-out);
            margin-bottom: 18px;
            animation: fadeInUp 0.5s var(--ease-out) both;
          }
          .ad-sidebar-card:hover {
            border-color: rgba(27,79,255,0.12);
            box-shadow: var(--shadow-sm);
          }

          .ad-sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
          }
          .ad-sidebar-label {
            font-family: var(--font-display);
            font-size: 0.58rem;
            font-weight: 700;
            color: var(--text-faint);
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .ad-sidebar-close {
            width: 22px; height: 22px;
            border-radius: 50%;
            background: transparent;
            color: var(--text-faint);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.78rem;
            cursor: pointer;
            opacity: 0;
            transition: all var(--dur-fast);
          }
          .ad-sidebar-card:hover .ad-sidebar-close { opacity: 1; }
          .ad-sidebar-close:hover {
            background: var(--bg-overlay);
            color: var(--crimson);
          }

          .ad-sidebar-img-wrap {
            width: 100%;
            height: 120px;
            overflow: hidden;
          }
          .ad-sidebar-img-wrap img {
            width: 100%; height: 100%;
            object-fit: cover;
            transition: transform var(--dur-slow) var(--ease-out);
          }
          .ad-sidebar-card:hover .ad-sidebar-img-wrap img {
            transform: scale(1.04);
          }

          .ad-sidebar-info { padding: 10px 12px; }
          .ad-sidebar-title {
            font-family: var(--font-display);
            font-size: 0.82rem;
            font-weight: 600;
            margin-bottom: 4px;
            letter-spacing: -0.01em;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            transition: color var(--dur-fast);
          }
          .ad-sidebar-card:hover .ad-sidebar-title {
            color: var(--cobalt);
          }
          .ad-sidebar-cta {
            font-family: var(--font-display);
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--cobalt);
          }
        `}</style>
      </div>
    );
  }

  // ─── FLOATING CORNER AD (Small notification style) ───
  if (position === 'floating') {
    if (!showFloating) return null;

    return (
      <div className="ad-float-card animate-slideInRight"
        onClick={() => handleClick(ad)}>
        <button className="ad-float-close" onClick={handleDismiss}>
          <IoClose />
        </button>
        <div className="ad-float-body">
          <div className="ad-float-img-wrap">
            <img src={ad.image} alt={ad.title} />
          </div>
          <div className="ad-float-info">
            <span className="ad-float-label">Sponsored</span>
            <h4 className="ad-float-title">{ad.title}</h4>
            <span className="ad-float-cta">View →</span>
          </div>
        </div>

        {/* Auto-dismiss progress */}
        <div className="ad-float-progress">
          <div className="ad-float-progress-bar"></div>
        </div>

        <style>{`
          .ad-float-card {
            position: fixed;
            bottom: 90px;
            right: 22px;
            z-index: 998;
            width: 280px;
            background: var(--bg-raised);
            border: 1px solid var(--border-sharp);
            border-radius: var(--r-lg);
            box-shadow: var(--shadow-xl);
            cursor: pointer;
            overflow: hidden;
            animation: slideInRight 0.5s var(--ease-spring) both;
            transition: transform var(--dur-mid) var(--ease-out),
                        box-shadow var(--dur-mid) var(--ease-out);
          }
          .ad-float-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-2xl);
          }

          .ad-float-close {
            position: absolute;
            top: 6px; right: 6px;
            width: 22px; height: 22px;
            border-radius: 50%;
            background: rgba(7,11,20,0.6);
            color: var(--white);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            cursor: pointer;
            z-index: 2;
            transition: all var(--dur-fast);
            opacity: 0;
          }
          .ad-float-card:hover .ad-float-close { opacity: 1; }
          .ad-float-close:hover {
            background: var(--crimson);
            transform: rotate(90deg);
          }

          .ad-float-body {
            display: flex;
            gap: 11px;
            padding: 12px;
            align-items: center;
          }
          .ad-float-img-wrap {
            width: 60px; height: 48px;
            border-radius: var(--r-sm);
            overflow: hidden;
            flex-shrink: 0;
            border: 1px solid var(--border-soft);
          }
          .ad-float-img-wrap img {
            width: 100%; height: 100%;
            object-fit: cover;
          }
          .ad-float-info { flex: 1; overflow: hidden; }
          .ad-float-label {
            font-family: var(--font-display);
            font-size: 0.55rem;
            font-weight: 700;
            color: var(--text-faint);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            display: block;
            margin-bottom: 2px;
          }
          .ad-float-title {
            font-family: var(--font-display);
            font-size: 0.78rem;
            font-weight: 600;
            color: var(--text-primary);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.3;
            margin-bottom: 3px;
            letter-spacing: -0.01em;
          }
          .ad-float-cta {
            font-family: var(--font-display);
            font-size: 0.68rem;
            font-weight: 600;
            color: var(--cobalt);
          }

          .ad-float-progress {
            height: 2px;
            background: var(--border-soft);
          }
          .ad-float-progress-bar {
            height: 100%;
            background: var(--grad-brand);
            animation: adProgress 15s linear forwards;
          }

          @keyframes adProgress {
            from { width: 100%; }
            to { width: 0%; }
          }

          @media (max-width: 480px) {
            .ad-float-card {
              right: 10px;
              bottom: 80px;
              width: 250px;
            }
          }
        `}</style>
      </div>
    );
  }

  // ─── FALLBACK: Minimal text link ───
  return (
    <div className="ad-text-link" onClick={() => handleClick(ad)}
      style={{ margin: '14px 0' }}>
      <span className="ad-text-badge">AD</span>
      <span className="ad-text-title">{ad.title}</span>
      <span className="ad-text-cta">→</span>

      <style>{`
        .ad-text-link {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 14px;
          background: var(--bg-overlay);
          border-radius: var(--r-md);
          cursor: pointer;
          transition: all var(--dur-fast) var(--ease-out);
          border: 1px solid transparent;
        }
        .ad-text-link:hover {
          background: var(--bg-surface);
          border-color: var(--border-soft);
        }
        .ad-text-badge {
          font-family: var(--font-display);
          font-size: 0.55rem;
          font-weight: 800;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 1px 5px;
          border: 1px solid var(--border-soft);
          border-radius: var(--r-xs);
          flex-shrink: 0;
        }
        .ad-text-title {
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-body);
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .ad-text-link:hover .ad-text-title { color: var(--cobalt); }
        .ad-text-cta {
          color: var(--cobalt);
          font-weight: 700;
          flex-shrink: 0;
          transition: transform var(--dur-fast);
        }
        .ad-text-link:hover .ad-text-cta { transform: translateX(3px); }
      `}</style>
    </div>
  );
};

export default AdBanner;
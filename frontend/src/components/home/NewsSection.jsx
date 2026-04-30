import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoEye, IoHeart, IoTime, IoArrowForward } from 'react-icons/io5';
import {
  getLocalizedText, formatNumber, timeAgo,
  truncateText, getImageUrl
} from '../../utils/helpers';
import api from '../../utils/api';
import ShareMenu from '../common/ShareMenu';

const NewsSection = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('latest');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [latestRes, viewedRes] = await Promise.all([
          api.get('/news?limit=6'),
          api.get('/news/most-viewed?limit=5')
        ]);
        setNews(latestRes.data.data);
        setMostViewed(viewedRes.data.data);
      } catch (e) { /* */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container">
          <div className="news-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton skeleton-image"></div>
                <div className="card-body">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-text-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featured = news[0];
  const rest = news.slice(1);

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('home.latestNews')}</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <button
                className={`tab-btn ${activeTab === 'latest' ? 'active' : ''}`}
                onClick={() => setActiveTab('latest')}>{t('news.latest')}
              </button>
              <button
                className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
                onClick={() => setActiveTab('popular')}>{t('news.popular')}
              </button>
            </div>
            <Link to="/news" className="btn btn-secondary btn-sm">
              {t('home.viewAll')} <IoArrowForward />
            </Link>
          </div>
        </div>

        {activeTab === 'latest' && featured && (
          <div className="news-grid-featured" style={{ marginBottom: '28px' }}>
            {/* Featured Card */}
            <Link
              to={`/news/${featured.slug}`}
              className="card featured-news-card animate-fadeInLeft"
            >
              <div className="card-image" style={{ aspectRatio: '16/9' }}>
                <img
                  src={getImageUrl(featured.featuredImage)}
                  alt={getLocalizedText(featured.title, i18n.language)}
                  loading="lazy"
                />
                <div className="card-image-overlay">
                  <span style={{ color: 'var(--white)', fontWeight: 600, fontSize: '0.88rem' }}>
                    {t('home.readMore')} →
                  </span>
                </div>
                <span className="card-badge card-badge-red">{featured.category}</span>
              </div>
              <div className="card-body">
                <div className="card-meta">
                  <span><IoTime /> {timeAgo(featured.createdAt)}</span>
                  <span><IoEye /> {formatNumber(featured.views)}</span>
                  <span><IoHeart /> {formatNumber(featured.likesCount)}</span>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.35rem', WebkitLineClamp: 3 }}>
                  {getLocalizedText(featured.title, i18n.language)}
                </h3>
                <p className="card-excerpt">
                  {truncateText(
                    getLocalizedText(featured.summary || featured.content, i18n.language),
                    200
                  )}
                </p>
                <div className="card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="avatar avatar-sm">
                      {featured.author?.avatar ? (
                        <img
                          src={getImageUrl(featured.author.avatar)}
                          alt={featured.author.name}
                        />
                      ) : (
                        <div className="avatar-placeholder" style={{ fontSize: '0.65rem' }}>
                          {featured.author?.name?.charAt(0) || 'A'}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {featured.author?.name}
                    </span>
                  </div>
                  <ShareMenu
                    url={`/news/${featured.slug}`}
                    title={getLocalizedText(featured.title, i18n.language)}
                  />
                </div>
              </div>
            </Link>

            {/* Most Viewed Sidebar */}
            <div className="mv-sidebar animate-fadeInRight">
              <h3 className="mv-sidebar-title">🔥 {t('home.mostViewed')}</h3>
              <div className="mv-list">
                {mostViewed.map((item, i) => (
                  <Link
                    to={`/news/${item.slug}`}
                    key={item._id}
                    className="mv-item"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <span className="mv-number">{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1 }}>
                      <h4 className="mv-item-title">
                        {getLocalizedText(item.title, i18n.language)}
                      </h4>
                      <div className="mv-item-meta">
                        <span><IoEye /> {formatNumber(item.views)}</span>
                        <span><IoHeart /> {formatNumber(item.likesCount)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="news-grid">
          {(activeTab === 'latest' ? rest : mostViewed).map((item, i) => (
            <Link
              to={`/news/${item.slug}`}
              key={item._id}
              className="card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="card-image">
                <img
                  src={getImageUrl(item.featuredImage)}
                  alt={getLocalizedText(item.title, i18n.language)}
                  loading="lazy"
                />
                <span className="card-badge card-badge-blue">{item.category}</span>
                <div className="card-image-overlay">
                  <span style={{ color: 'var(--white)', fontWeight: 500, fontSize: '0.82rem' }}>
                    {t('home.readMore')} →
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="card-meta">
                  <span><IoTime /> {timeAgo(item.createdAt)}</span>
                  <span><IoEye /> {formatNumber(item.views)}</span>
                </div>
                <h3 className="card-title">
                  {getLocalizedText(item.title, i18n.language)}
                </h3>
                <p className="card-excerpt">
                  {truncateText(
                    getLocalizedText(item.summary || item.content, i18n.language),
                    120
                  )}
                </p>
                <div className="card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div className="avatar avatar-sm">
                      {item.author?.avatar ? (
                        <img src={getImageUrl(item.author.avatar)} alt={item.author.name} />
                      ) : (
                        <div className="avatar-placeholder" style={{ fontSize: '0.65rem' }}>
                          {item.author?.name?.charAt(0) || 'A'}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.author?.name}
                    </span>
                  </div>
                  <span className="tag tag-outline" style={{ fontSize: '0.68rem' }}>
                    <IoHeart /> {formatNumber(item.likesCount)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .featured-news-card .card-image { aspect-ratio: 16/9; }

        .mv-sidebar {
          background: var(--bg-surface);
          border-radius: var(--r-lg);
          padding: 18px;
          border: 1px solid var(--border-sharp);
          height: fit-content;
          position: sticky;
          top: 120px;
        }
        .mv-sidebar-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 7px;
          letter-spacing: -0.01em;
        }
        .mv-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mv-item {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding: 9px;
          border-radius: var(--r-md);
          transition: all var(--dur-fast) var(--ease-out);
          animation: fadeInRight 0.45s var(--ease-out) both;
        }
        .mv-item:hover { background: var(--bg-overlay); }
        .mv-number {
          font-size: 1.35rem;
          font-weight: 800;
          font-family: var(--font-display);
          background: var(--grad-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          flex-shrink: 0;
          line-height: 1;
          min-width: 28px;
          letter-spacing: -0.03em;
        }
        .mv-item-title {
          font-family: var(--font-display);
          font-size: 0.84rem;
          font-weight: 600;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.35;
          margin-bottom: 3px;
          transition: color var(--dur-fast);
          letter-spacing: -0.01em;
        }
        .mv-item:hover .mv-item-title { color: var(--cobalt); }
        .mv-item-meta {
          display: flex;
          gap: 9px;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .mv-item-meta span {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        @media (max-width: 768px) {
          .mv-sidebar { position: relative; top: 0; }
        }
      `}</style>
    </section>
  );
};

export default NewsSection;
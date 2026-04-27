import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoEye, IoHeart, IoTime } from 'react-icons/io5';
import { getLocalizedText, formatNumber, timeAgo, truncateText } from '../utils/helpers';
import api from '../utils/api';

const StoriesPage = () => {
  const { t, i18n } = useTranslation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const categories = ['', 'personal', 'inspirational', 'cultural', 'historical', 'fiction'];

  useEffect(() => { fetchStories(); }, [filter]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      let url = '/stories?limit=20';
      if (filter) url += `&category=${filter}`;
      const res = await api.get(url);
      setStories(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>{t('nav.stories')} — THE BLUEX</title></Helmet>

      <div className="sp-hero">
        <div className="sp-hero-bg">
          <div className="sp-orb sp-orb-1"></div>
          <div className="sp-orb sp-orb-2"></div>
        </div>
        <div className="container sp-hero-content">
          <h1 className="sp-hero-title animate-fadeInUp">📖 {t('nav.stories')}</h1>
          <p className="sp-hero-desc animate-fadeInUp stagger-2">
            Read inspiring stories from people across Rwanda
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        <div className="filter-pills" style={{
          marginBottom: '22px', justifyContent: 'center',
          display: 'flex', flexWrap: 'wrap', gap: '6px'
        }}>
          {categories.map((cat) => (
            <button key={cat}
              className={`filter-pill ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}>
              {cat || t('news.all')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="news-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton skeleton-image"></div>
                <div className="card-body">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📖</div>
            <h3 className="empty-state-title">No stories found</h3>
            <p className="empty-state-text">{t('common.noResults')}</p>
          </div>
        ) : (
          <div className="news-grid">
            {stories.map((story, index) => (
              <Link to={`/stories/${story._id}`} key={story._id}
                className="card animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}>
                {story.image && (
                  <div className="card-image">
                    <img src={story.image}
                      alt={getLocalizedText(story.title, i18n.language)}
                      loading="lazy" />
                    <span className="card-badge card-badge-green">{story.category}</span>
                    <div className="card-image-overlay">
                      <span style={{ color: 'var(--white)', fontWeight: 500 }}>
                        {t('home.readMore')} →
                      </span>
                    </div>
                  </div>
                )}
                <div className="card-body">
                  <div className="card-meta">
                    <span><IoTime /> {timeAgo(story.createdAt)}</span>
                    <span><IoEye /> {formatNumber(story.views)}</span>
                    <span><IoHeart /> {formatNumber(story.likesCount)}</span>
                  </div>
                  <h3 className="card-title">
                    {getLocalizedText(story.title, i18n.language)}
                  </h3>
                  <p className="card-excerpt">
                    {truncateText(getLocalizedText(story.content, i18n.language), 150)}
                  </p>
                  <div className="card-footer">
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {t('news.byAuthor')} {story.authorName || story.author?.name}
                    </span>
                    {!story.image && (
                      <span className="tag tag-green" style={{ fontSize: '0.68rem' }}>
                        {story.category}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .sp-hero {
          position: relative;
          background: var(--grad-dark);
          padding: 56px 0 46px;
          overflow: hidden;
          margin-top: calc(var(--navbar-height) * -1);
          padding-top: calc(var(--navbar-height) + 36px);
        }
        .sp-hero-bg { position: absolute; inset: 0; }
        .sp-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.18;
        }
        .sp-orb-1 {
          width: 280px; height: 280px; background: var(--violet);
          top: -90px; right: 8%;
          animation: float 7s ease-in-out infinite;
        }
        .sp-orb-2 {
          width: 200px; height: 200px; background: var(--jade);
          bottom: -50px; left: 18%;
          animation: float 9s ease-in-out infinite reverse;
        }
        .sp-hero-content { position: relative; z-index: 2; text-align: center; }
        .sp-hero-title {
          font-family: var(--font-display); font-size: 2.4rem;
          font-weight: 800; color: var(--white);
          margin-bottom: 10px; letter-spacing: -0.03em;
        }
        .sp-hero-desc { color: rgba(255,255,255,0.52); font-size: 1rem; }

        .filter-pill {
          padding: 5px 13px; border-radius: var(--r-full);
          background: var(--bg-overlay); color: var(--text-body);
          font-family: var(--font-display); font-size: 0.78rem;
          font-weight: 600; cursor: pointer;
          transition: all var(--dur-fast) var(--ease-out);
          border: 1px solid transparent;
        }
        .filter-pill:hover { background: var(--cobalt-xpale); color: var(--cobalt); }
        .filter-pill.active {
          background: var(--grad-cobalt); color: var(--white);
          box-shadow: var(--shadow-cobalt);
        }
        [data-theme="dark"] .filter-pill:hover {
          background: rgba(27,79,255,0.12); color: var(--cobalt-light);
        }

        @media (max-width: 768px) {
          .sp-hero-title { font-size: 1.7rem; }
        }
      `}</style>
    </>
  );
};

export default StoriesPage;
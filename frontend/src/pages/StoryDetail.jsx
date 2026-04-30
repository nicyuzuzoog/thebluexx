import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoArrowBack, IoEye, IoHeart } from 'react-icons/io5';
import {
  getLocalizedText, formatNumber, formatDate, getImageUrl
} from '../utils/helpers';
import api from '../utils/api';
import ShareMenu from '../components/common/ShareMenu';

const StoryDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchStory = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/stories/${id}`);
      setStory(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '780px', padding: '40px 20px' }}>
        <div className="skeleton skeleton-title" style={{ height: '32px', marginBottom: '16px' }}></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="empty-state" style={{ minHeight: '50vh' }}>
        <div className="empty-state-icon">📖</div>
        <h3 className="empty-state-title">Story not found</h3>
        <Link to="/stories" className="btn btn-primary" style={{ marginTop: '16px' }}>
          <IoArrowBack /> {t('common.goBack')}
        </Link>
      </div>
    );
  }

  const title = getLocalizedText(story.title, i18n.language);
  const content = getLocalizedText(story.content, i18n.language);

  return (
    <>
      <Helmet>
        <title>{title} — THE BLUEX</title>
      </Helmet>

      <div className="container" style={{ maxWidth: '780px', padding: '28px 20px 60px' }}>
        <Link to="/stories" className="btn btn-ghost btn-sm" style={{ marginBottom: '18px' }}>
          <IoArrowBack /> {t('common.goBack')}
        </Link>

        <article className="animate-fadeInUp">
          {story.image && (
            <img
              src={getImageUrl(story.image)}
              alt={title}
              style={{
                width: '100%',
                height: '380px',
                objectFit: 'cover',
                borderRadius: 'var(--r-lg)',
                marginBottom: '22px'
              }}
            />
          )}

          <span className="tag tag-green" style={{ marginBottom: '12px', display: 'inline-flex' }}>
            {story.category}
          </span>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.28,
            marginBottom: '14px',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}>
            {title}
          </h1>

          <div className="sd-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar">
                {story.author?.avatar ? (
                  <img
                    src={getImageUrl(story.author.avatar)}
                    alt={story.authorName || story.author?.name}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {story.authorName?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {story.authorName || story.author?.name}
                </p>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {formatDate(story.createdAt, i18n.language)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <IoEye /> {formatNumber(story.views)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <IoHeart /> {formatNumber(story.likesCount)}
                </span>
              </div>
              <ShareMenu url={`/stories/${story._id}`} title={title} />
            </div>
          </div>

          <div className="sd-body">{content}</div>
        </article>
      </div>

      <style>{`
        .sd-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-soft);
        }
        .sd-body {
          font-family: var(--font-body);
          font-size: 1.02rem;
          line-height: 1.9;
          color: var(--text-body);
          white-space: pre-wrap;
          word-break: break-word;
        }
        @media (max-width: 640px) {
          .sd-meta { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </>
  );
};

export default StoryDetail;
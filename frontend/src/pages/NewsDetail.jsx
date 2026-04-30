import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  IoEye, IoHeart, IoHeartOutline, IoChatbubble,
  IoTime, IoArrowBack
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import {
  getLocalizedText, formatNumber, formatDate,
  timeAgo, getImageUrl
} from '../utils/helpers';
import api from '../utils/api';
import ShareMenu from '../components/common/ShareMenu';
import CommentSection from '../components/common/CommentSection';
import EmailModal from '../components/common/EmailModal';
import AdBanner from '../components/home/AdBanner';

const NewsDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    fetchNews();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/news/${slug}`);
      setNews(res.data.data);
      setLikesCount(res.data.data.likesCount);
      const userEmail = localStorage.getItem('bluex_user_email');
      if (userEmail) {
        setLiked(res.data.data.likes?.some(l => l.email === userEmail));
      }
      if (res.data.data.category) {
        const relRes = await api.get(`/news?category=${res.data.data.category}&limit=4`);
        setRelated(
          relRes.data.data.filter(n => n._id !== res.data.data._id).slice(0, 3)
        );
      }
    } catch (error) {
      console.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const email = localStorage.getItem('bluex_user_email');
    if (!email) {
      setPendingAction('like');
      setShowEmailModal(true);
      return;
    }
    try {
      const res = await api.post(`/news/${news._id}/like`, { email });
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  const handleShare = async () => {
    try { await api.post(`/news/${news._id}/share`); } catch (e) { /* */ }
  };

  const handleEmailSubmit = ({ email }) => {
    localStorage.setItem('bluex_user_email', email);
    setShowEmailModal(false);
    if (pendingAction === 'like') handleLike();
    setPendingAction(null);
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '900px', padding: '40px 20px' }}>
        <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--r-lg)', marginBottom: '24px' }}></div>
        <div className="skeleton skeleton-title" style={{ height: '32px', marginBottom: '16px' }}></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="empty-state" style={{ minHeight: '50vh' }}>
        <div className="empty-state-icon">📭</div>
        <h3 className="empty-state-title">News not found</h3>
        <Link to="/news" className="btn btn-primary" style={{ marginTop: '16px' }}>
          <IoArrowBack /> {t('common.goBack')}
        </Link>
      </div>
    );
  }

  const title = getLocalizedText(news.title, i18n.language);
  const content = getLocalizedText(news.content, i18n.language);

  return (
    <>
      <Helmet>
        <title>{title} — THE BLUEX</title>
        <meta name="description" content={getLocalizedText(news.summary, i18n.language)} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={getImageUrl(news.featuredImage)} />
      </Helmet>

      <article className="news-detail-page">
        {/* Hero */}
        <div className="nd-hero animate-fadeIn">
          <img
            src={getImageUrl(news.featuredImage)}
            alt={title}
            className="nd-hero-img"
          />
          <div className="nd-hero-overlay">
            <div className="container">
              <Link to="/news" className="nd-back-btn">
                <IoArrowBack /> {t('common.goBack')}
              </Link>
              <span className="card-badge card-badge-blue"
                style={{ fontSize: '0.8rem', padding: '5px 14px' }}>
                {news.category}
              </span>
            </div>
          </div>
        </div>

        <div className="container nd-container">
          <div className="nd-layout">
            {/* Main */}
            <div className="nd-main animate-fadeInUp">
              <h1 className="nd-title">{title}</h1>

              <div className="nd-meta">
                <div className="nd-author">
                  <div className="avatar">
                    {news.author?.avatar ? (
                      <img
                        src={getImageUrl(news.author.avatar)}
                        alt={news.author.name}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {news.author?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="nd-author-name">{news.author?.name}</p>
                    <p className="nd-author-date">
                      {formatDate(news.publishedAt || news.createdAt, i18n.language)}
                    </p>
                  </div>
                </div>
                <div className="nd-stats">
                  <span><IoEye /> {formatNumber(news.views)}</span>
                  <span><IoHeart /> {formatNumber(likesCount)}</span>
                  <span><IoChatbubble /> {news.comments?.length || 0}</span>
                </div>
              </div>

              {/* Tags */}
              {news.tags?.length > 0 && (
                <div className="nd-tags">
                  {news.tags.map((tag, i) => (
                    <Link to={`/news?search=${tag}`} key={i} className="tag tag-blue">
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Content */}
              <div
                className="nd-body"
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
              />

              {/* Actions */}
              <div className="nd-actions">
                <button
                  className={`nd-action-btn ${liked ? 'liked' : ''}`}
                  onClick={handleLike}
                >
                  {liked ? <IoHeart /> : <IoHeartOutline />}
                  <span>{likesCount} {t('common.like')}</span>
                </button>
                <ShareMenu
                  url={`/news/${news.slug}`}
                  title={title}
                  onShare={handleShare}
                />
              </div>

              <AdBanner position="in-feed" />
              <CommentSection newsId={news._id} comments={news.comments} />
            </div>

            {/* Sidebar */}
            <aside className="nd-sidebar animate-fadeInRight">
              <AdBanner position="sidebar" />
              {related.length > 0 && (
                <div className="nd-related">
                  <h3 className="nd-related-title">{t('news.relatedNews')}</h3>
                  <div className="nd-related-list">
                    {related.map((item, index) => (
                      <Link
                        to={`/news/${item.slug}`}
                        key={item._id}
                        className="nd-related-item animate-fadeInRight"
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="nd-related-img">
                          <img
                            src={getImageUrl(item.featuredImage)}
                            alt={getLocalizedText(item.title, i18n.language)}
                          />
                        </div>
                        <div className="nd-related-info">
                          <h4>{getLocalizedText(item.title, i18n.language)}</h4>
                          <span><IoTime /> {timeAgo(item.createdAt)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        title={t('common.likeRequiresEmail')}
      />

      <style>{`
        .news-detail-page { position: relative; }
        .nd-hero { position: relative; height: 440px; overflow: hidden; margin-top: calc(var(--navbar-height) * -1); }
        .nd-hero-img { width: 100%; height: 100%; object-fit: cover; }
        .nd-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(7,11,20,0.85) 0%, rgba(7,11,20,0.18) 55%, rgba(7,11,20,0.42) 100%);
          display: flex; align-items: flex-end; padding-bottom: 28px;
        }
        .nd-hero-overlay .container { display: flex; align-items: center; gap: 14px; }
        .nd-back-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: var(--r-full);
          background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);
          color: var(--white); font-family: var(--font-display);
          font-size: 0.82rem; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.12);
          transition: all var(--dur-fast) var(--ease-out);
        }
        .nd-back-btn:hover { background: rgba(255,255,255,0.2); }
        .nd-container { max-width: 1180px; padding: 28px 20px 60px; }
        .nd-layout { display: grid; grid-template-columns: 1fr 320px; gap: 36px; }
        .nd-title { font-family: var(--font-serif); font-size: 2.1rem; font-weight: 700; line-height: 1.28; margin-bottom: 18px; letter-spacing: -0.02em; color: var(--text-primary); }
        .nd-meta { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; padding-bottom: 18px; border-bottom: 1px solid var(--border-soft); margin-bottom: 18px; }
        .nd-author { display: flex; align-items: center; gap: 11px; }
        .nd-author-name { font-family: var(--font-display); font-weight: 600; font-size: 0.92rem; }
        .nd-author-date { font-size: 0.76rem; color: var(--text-muted); }
        .nd-stats { display: flex; gap: 14px; }
        .nd-stats span { display: flex; align-items: center; gap: 3px; font-size: 0.82rem; color: var(--text-muted); }
        .nd-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 22px; }
        .nd-body { font-family: var(--font-body); font-size: 1.02rem; line-height: 1.9; color: var(--text-body); margin-bottom: 28px; }
        .nd-body p { margin-bottom: 14px; }
        .nd-body img { border-radius: var(--r-md); margin: 18px 0; max-width: 100%; }
        .nd-body h2, .nd-body h3 { font-family: var(--font-display); margin: 22px 0 10px; color: var(--text-primary); }
        .nd-body blockquote { border-left: 3px solid var(--cobalt); padding: 10px 18px; margin: 18px 0; background: var(--cobalt-xpale); border-radius: 0 var(--r-md) var(--r-md) 0; font-style: italic; }
        [data-theme="dark"] .nd-body blockquote { background: rgba(27,79,255,0.08); }
        .nd-actions { display: flex; align-items: center; gap: 10px; padding: 14px 0; border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); margin-bottom: 28px; }
        .nd-action-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 16px; border-radius: var(--r-full); background: var(--bg-overlay); color: var(--text-body); font-family: var(--font-display); font-size: 0.88rem; font-weight: 600; border: none; cursor: pointer; transition: all var(--dur-mid) var(--ease-out); }
        .nd-action-btn:hover { background: var(--cobalt-xpale); color: var(--cobalt); }
        .nd-action-btn.liked { background: rgba(229,52,74,0.08); color: var(--crimson); }
        [data-theme="dark"] .nd-action-btn:hover { background: rgba(27,79,255,0.1); }
        .nd-sidebar { position: sticky; top: 120px; height: fit-content; }
        .nd-related { background: var(--bg-surface); border-radius: var(--r-lg); border: 1px solid var(--border-sharp); padding: 18px; margin-top: 18px; }
        .nd-related-title { font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; margin-bottom: 14px; padding-bottom: 9px; border-bottom: 1px solid var(--border-soft); letter-spacing: -0.01em; }
        .nd-related-list { display: flex; flex-direction: column; gap: 12px; }
        .nd-related-item { display: flex; gap: 11px; padding: 7px; border-radius: var(--r-md); transition: all var(--dur-fast) var(--ease-out); }
        .nd-related-item:hover { background: var(--bg-overlay); }
        .nd-related-img { width: 76px; height: 56px; border-radius: var(--r-sm); overflow: hidden; flex-shrink: 0; }
        .nd-related-img img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--dur-mid) var(--ease-out); }
        .nd-related-item:hover .nd-related-img img { transform: scale(1.06); }
        .nd-related-info h4 { font-family: var(--font-display); font-size: 0.8rem; font-weight: 600; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 3px; transition: color var(--dur-fast); letter-spacing: -0.01em; }
        .nd-related-item:hover .nd-related-info h4 { color: var(--cobalt); }
        .nd-related-info span { font-size: 0.7rem; color: var(--text-muted); display: flex; align-items: center; gap: 3px; }
        @media (max-width: 1024px) { .nd-layout { grid-template-columns: 1fr; } .nd-sidebar { position: relative; top: 0; } }
        @media (max-width: 768px) { .nd-hero { height: 280px; } .nd-title { font-size: 1.55rem; } .nd-body { font-size: 0.94rem; } }
        @media (max-width: 480px) { .nd-title { font-size: 1.3rem; } .nd-container { padding: 16px 14px 40px; } }
      `}</style>
    </>
  );
};

export default NewsDetail;
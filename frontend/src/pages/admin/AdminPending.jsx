import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  IoCheckmarkCircle, IoCloseCircle,
  IoNewspaper, IoFilm, IoBookmarks
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import { getLocalizedText, timeAgo } from '../../utils/helpers';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminPending = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({ pendingNews: [], pendingMovies: [], pendingStories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/admin/pending');
      setData(res.data.data);
    } catch (e) { /* */ } finally { setLoading(false); }
  };

  const handleAction = async (type, id, status) => {
    try {
      await api.put(`/admin/content/${type}/${id}/status`, { status });
      setData(prev => ({
        pendingNews: type === 'news' ? prev.pendingNews.filter(i => i._id !== id) : prev.pendingNews,
        pendingMovies: type === 'movie' ? prev.pendingMovies.filter(i => i._id !== id) : prev.pendingMovies,
        pendingStories: type === 'story' ? prev.pendingStories.filter(i => i._id !== id) : prev.pendingStories,
      }));
      toast.success(`Content ${status}!`);
    } catch (e) { toast.error('Failed'); }
  };

  const totalPending = (data.pendingNews?.length || 0) +
    (data.pendingMovies?.length || 0) +
    (data.pendingStories?.length || 0);

  const renderItem = (item, type) => {
    const authorName = type === 'news'
      ? item.author?.name
      : type === 'movie'
        ? item.addedBy?.name
        : item.authorName;

    return (
      <div key={item._id} className="ap-item animate-fadeInUp">
        <div className="ap-item-info">
          <h4 className="ap-item-title">
            {getLocalizedText(item.title, i18n.language)}
          </h4>
          <div className="ap-item-meta">
            <span>{authorName}</span>
            {item.category && (
              <span className="tag tag-outline" style={{ fontSize: '0.65rem' }}>
                {item.category}
              </span>
            )}
            <span>{timeAgo(item.createdAt)}</span>
          </div>
        </div>
        <div className="ap-item-actions">
          <button
            className="btn btn-sm"
            style={{
              background: 'rgba(0,194,111,0.08)',
              color: 'var(--jade)',
              border: '1px solid rgba(0,194,111,0.2)'
            }}
            onClick={() => handleAction(type, item._id, 'published')}
          >
            <IoCheckmarkCircle /> {t('admin.approve')}
          </button>
          <button
            className="btn btn-sm"
            style={{
              background: 'rgba(229,52,74,0.08)',
              color: 'var(--crimson)',
              border: '1px solid rgba(229,52,74,0.2)'
            }}
            onClick={() => handleAction(type, item._id, 'rejected')}
          >
            <IoCloseCircle /> {t('admin.reject')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout title={t('admin.pendingContent')}>
      <Helmet><title>{t('admin.pendingContent')} — THE BLUEX</title></Helmet>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="ap-section">
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-soft)' }}>
                <div className="skeleton skeleton-title" style={{ width: '35%' }}></div>
              </div>
              {[...Array(2)].map((_, j) => (
                <div key={j} style={{ padding: '14px 18px' }}>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-text-sm"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : totalPending === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h3 className="empty-state-title">All caught up!</h3>
          <p className="empty-state-text">No pending content to review.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {data.pendingNews?.length > 0 && (
            <div className="ap-section">
              <div className="ap-section-header">
                <span className="ap-section-title">
                  <IoNewspaper /> Pending News
                </span>
                <span className="ap-count">{data.pendingNews.length}</span>
              </div>
              {data.pendingNews.map(item => renderItem(item, 'news'))}
            </div>
          )}

          {data.pendingMovies?.length > 0 && (
            <div className="ap-section">
              <div className="ap-section-header">
                <span className="ap-section-title">
                  <IoFilm /> Pending Movies
                </span>
                <span className="ap-count">{data.pendingMovies.length}</span>
              </div>
              {data.pendingMovies.map(item => renderItem(item, 'movie'))}
            </div>
          )}

          {data.pendingStories?.length > 0 && (
            <div className="ap-section">
              <div className="ap-section-header">
                <span className="ap-section-title">
                  <IoBookmarks /> Pending Stories
                </span>
                <span className="ap-count">{data.pendingStories.length}</span>
              </div>
              {data.pendingStories.map(item => renderItem(item, 'story'))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .ap-section {
          background: var(--bg-surface);
          border-radius: var(--r-lg);
          border: 1px solid var(--border-sharp);
          overflow: hidden;
        }
        .ap-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 18px;
          border-bottom: 1px solid var(--border-soft);
          background: var(--grad-card-hover);
        }
        .ap-section-title {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .ap-count {
          background: var(--cobalt-xpale);
          color: var(--cobalt);
          padding: 2px 10px;
          border-radius: var(--r-full);
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 700;
        }
        [data-theme="dark"] .ap-count {
          background: rgba(27,79,255,0.12);
          color: var(--cobalt-light);
        }

        .ap-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-soft);
          transition: background var(--dur-fast) var(--ease-out);
          flex-wrap: wrap;
        }
        .ap-item:last-child { border-bottom: none; }
        .ap-item:hover { background: var(--bg-overlay); }

        .ap-item-info { flex: 1; min-width: 200px; }
        .ap-item-title {
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 5px;
          letter-spacing: -0.01em;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ap-item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.74rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .ap-item-actions {
          display: flex;
          gap: 7px;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .ap-item { flex-direction: column; }
          .ap-item-actions { align-self: flex-start; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminPending;
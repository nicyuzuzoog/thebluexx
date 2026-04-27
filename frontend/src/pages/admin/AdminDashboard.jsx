import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  IoPeople, IoNewspaper, IoFilm, IoNotifications,
  IoCheckmarkCircle, IoEye, IoHeart, IoTrendingUp,
  IoAdd, IoArrowForward, IoTime
} from 'react-icons/io5';
import { formatNumber, getLocalizedText, timeAgo } from '../../utils/helpers';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const statCards = data ? [
    {
      label: t('admin.totalUsers'), value: data.stats.totalUsers,
      icon: <IoPeople />, color: 'var(--cobalt)', bg: 'rgba(27,79,255,0.08)',
      link: '/admin/users'
    },
    {
      label: t('admin.totalNews'), value: data.stats.totalNews,
      icon: <IoNewspaper />, color: 'var(--jade)', bg: 'rgba(0,194,111,0.08)',
      link: '/admin/news'
    },
    {
      label: t('admin.totalMovies'), value: data.stats.totalMovies,
      icon: <IoFilm />, color: 'var(--violet)', bg: 'rgba(124,58,237,0.08)',
      link: '/admin/movies'
    },
    {
      label: t('admin.totalSubscribers'), value: data.stats.totalSubscribers,
      icon: <IoNotifications />, color: 'var(--amber)', bg: 'rgba(245,158,11,0.08)',
      link: '/admin/subscribers'
    },
    {
      label: t('admin.pendingApproval'),
      value: (data.stats.pendingNews || 0) + (data.stats.pendingMovies || 0),
      icon: <IoCheckmarkCircle />, color: 'var(--crimson)', bg: 'rgba(229,52,74,0.08)',
      link: '/admin/pending'
    },
    {
      label: 'Publishers', value: data.stats.totalPublishers,
      icon: <IoPeople />, color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)',
      link: '/admin/users'
    },
  ] : [];

  return (
    <AdminLayout title={t('admin.dashboard')}>
      <Helmet><title>{t('admin.dashboard')} — THE BLUEX</title></Helmet>

      {loading ? (
        <div>
          <div className="ad-stats-grid" style={{ marginBottom: '24px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="stat-card">
                <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: 'var(--r-md)', marginBottom: '11px' }}></div>
                <div className="skeleton" style={{ width: '55px', height: '26px', marginBottom: '5px' }}></div>
                <div className="skeleton skeleton-text-sm"></div>
              </div>
            ))}
          </div>
          <div className="ad-panels-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="ad-panel">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-soft)' }}>
                  <div className="skeleton skeleton-title" style={{ width: '40%' }}></div>
                </div>
                <div style={{ padding: '14px 18px' }}>
                  {[...Array(4)].map((_, j) => (
                    <div key={j} style={{ marginBottom: '12px' }}>
                      <div className="skeleton skeleton-text"></div>
                      <div className="skeleton skeleton-text-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : data ? (
        <>
          {/* Quick Actions */}
          <div className="ad-quick-actions">
            <Link to="/admin/news/create" className="btn btn-primary btn-sm">
              <IoAdd /> {t('admin.createNews')}
            </Link>
            <Link to="/admin/movies/create" className="btn btn-green btn-sm">
              <IoAdd /> {t('admin.createMovie')}
            </Link>
            <Link to="/admin/pending" className="btn btn-secondary btn-sm">
              <IoCheckmarkCircle /> {t('admin.pendingContent')}
              {(data.stats.pendingNews + data.stats.pendingMovies) > 0 && (
                <span className="ad-badge">
                  {data.stats.pendingNews + data.stats.pendingMovies}
                </span>
              )}
            </Link>
          </div>

          {/* Stats */}
          <div className="ad-stats-grid">
            {statCards.map((stat, i) => (
              <Link to={stat.link} key={i}
                className="stat-card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="stat-card-icon" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-card-number">{formatNumber(stat.value)}</div>
                <div className="stat-card-label">{stat.label}</div>
              </Link>
            ))}
          </div>

          {/* Panels */}
          <div className="ad-panels-grid">
            {/* Recent News */}
            <div className="ad-panel animate-fadeInUp stagger-2">
              <div className="ad-panel-header">
                <h3 className="ad-panel-title"><IoNewspaper /> Recent News</h3>
                <Link to="/admin/news" className="btn btn-ghost btn-sm">
                  View All <IoArrowForward />
                </Link>
              </div>
              <div className="ad-panel-body">
                {data.recentNews?.length > 0 ? data.recentNews.map((item) => (
                  <div key={item._id} className="ad-list-item">
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p className="ad-list-title">
                        {getLocalizedText(item.title, i18n.language)}
                      </p>
                      <div className="ad-list-meta">
                        <span>{item.author?.name}</span>
                        <span>·</span>
                        <span><IoTime /> {timeAgo(item.createdAt)}</span>
                      </div>
                    </div>
                    <span className="ad-list-stat">
                      <IoEye /> {formatNumber(item.views)}
                    </span>
                  </div>
                )) : (
                  <p className="ad-empty">No news yet</p>
                )}
              </div>
            </div>

            {/* Recent Movies */}
            <div className="ad-panel animate-fadeInUp stagger-3">
              <div className="ad-panel-header">
                <h3 className="ad-panel-title"><IoFilm /> Recent Movies</h3>
                <Link to="/admin/movies" className="btn btn-ghost btn-sm">
                  View All <IoArrowForward />
                </Link>
              </div>
              <div className="ad-panel-body">
                {data.recentMovies?.length > 0 ? data.recentMovies.map((item) => (
                  <div key={item._id} className="ad-list-item">
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p className="ad-list-title">
                        {getLocalizedText(item.title, i18n.language)}
                      </p>
                      <div className="ad-list-meta">
                        <span>{item.addedBy?.name}</span>
                        <span>·</span>
                        <span><IoTime /> {timeAgo(item.createdAt)}</span>
                      </div>
                    </div>
                    <span className="ad-list-stat">
                      <IoEye /> {formatNumber(item.views)}
                    </span>
                  </div>
                )) : (
                  <p className="ad-empty">No movies yet</p>
                )}
              </div>
            </div>

            {/* Top News */}
            <div className="ad-panel animate-fadeInUp stagger-4">
              <div className="ad-panel-header">
                <h3 className="ad-panel-title"><IoTrendingUp /> Top News</h3>
              </div>
              <div className="ad-panel-body">
                {data.topNews?.map((item, i) => (
                  <div key={item._id} className="ad-list-item">
                    <span className="ad-rank gradient-text">{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p className="ad-list-title">
                        {getLocalizedText(item.title, i18n.language)}
                      </p>
                    </div>
                    <span className="ad-list-stat">{formatNumber(item.views)} views</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Movies */}
            <div className="ad-panel animate-fadeInUp stagger-5">
              <div className="ad-panel-header">
                <h3 className="ad-panel-title"><IoTrendingUp /> Top Movies</h3>
              </div>
              <div className="ad-panel-body">
                {data.topMovies?.map((item, i) => (
                  <div key={item._id} className="ad-list-item">
                    <span className="ad-rank gradient-text">{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p className="ad-list-title">
                        {getLocalizedText(item.title, i18n.language)}
                      </p>
                    </div>
                    <span className="ad-list-stat">{formatNumber(item.views)} views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}

      <style>{`
        .ad-quick-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .ad-badge {
          background: var(--crimson);
          color: var(--white);
          border-radius: 50%;
          width: 18px; height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
        }

        .ad-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .ad-panels-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .ad-panel {
          background: var(--bg-surface);
          border-radius: var(--r-lg);
          border: 1px solid var(--border-sharp);
          overflow: hidden;
        }

        .ad-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          border-bottom: 1px solid var(--border-soft);
          background: var(--grad-card-hover);
        }
        .ad-panel-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .ad-panel-body {
          max-height: 300px;
          overflow-y: auto;
        }

        .ad-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border-soft);
          transition: background var(--dur-fast) var(--ease-out);
        }
        .ad-list-item:last-child { border-bottom: none; }
        .ad-list-item:hover { background: var(--bg-overlay); }

        .ad-list-title {
          font-family: var(--font-display);
          font-size: 0.83rem;
          font-weight: 600;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 2px;
          letter-spacing: -0.01em;
        }
        .ad-list-meta {
          display: flex;
          gap: 5px;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .ad-list-stat {
          font-size: 0.74rem;
          color: var(--text-muted);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
        }
        .ad-rank {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 800;
          min-width: 26px;
          letter-spacing: -0.03em;
        }
        .ad-empty {
          padding: 20px 16px;
          font-size: 0.84rem;
          color: var(--text-muted);
          text-align: center;
          font-family: var(--font-display);
        }

        @media (max-width: 1024px) {
          .ad-panels-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .ad-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .stat-card { padding: 14px; }
          .stat-card-number { font-size: 1.5rem; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
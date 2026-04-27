import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoMail, IoDownload } from 'react-icons/io5';
import { timeAgo } from '../../utils/helpers';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminSubscribers = () => {
  const { t } = useTranslation();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get('/subscribers');
      setSubscribers(res.data.data);
      setTotal(res.data.total);
    } catch (e) { /* */ } finally { setLoading(false); }
  };

  const exportCSV = () => {
    const csv = [
      ['Email', 'Name', 'Subscribed To', 'Language', 'Status', 'Date'].join(','),
      ...subscribers.map(s => [
        s.email, s.name || '', s.subscribedTo,
        s.preferredLanguage,
        s.isActive ? 'Active' : 'Inactive',
        new Date(s.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bluex_subscribers.csv';
    a.click();
  };

  return (
    <AdminLayout title={t('admin.subscribers')}>
      <Helmet><title>{t('admin.subscribers')} — THE BLUEX</title></Helmet>

      <div className="as-header">
        <div className="as-stat">
          <span className="as-stat-number gradient-text">{total}</span>
          <span className="as-stat-label">Total Subscribers</span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
          <IoDownload /> Export CSV
        </button>
      </div>

      <div className="at-wrapper">
        <table className="at-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Subscribed To</th>
              <th>Language</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j}><div className="skeleton skeleton-text"></div></td>
                  ))}
                </tr>
              ))
            ) : subscribers.length === 0 ? (
              <tr><td colSpan="6" className="at-empty">No subscribers yet</td></tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IoMail style={{ color: 'var(--cobalt)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.84rem' }}>{sub.email}</span>
                    </div>
                  </td>
                  <td className="at-cell-sub">{sub.name || '—'}</td>
                  <td>
                    <span className="tag tag-blue" style={{ fontSize: '0.65rem' }}>
                      {sub.subscribedTo}
                    </span>
                  </td>
                  <td className="at-cell-sub">
                    {sub.preferredLanguage === 'en' ? '🇬🇧'
                      : sub.preferredLanguage === 'fr' ? '🇫🇷' : '🇷🇼'}
                    {' '}{sub.preferredLanguage}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 9px',
                      borderRadius: 'var(--r-full)',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      background: sub.isActive ? 'rgba(0,194,111,0.08)' : 'rgba(229,52,74,0.08)',
                      color: sub.isActive ? 'var(--jade)' : 'var(--crimson)',
                    }}>
                      {sub.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="at-cell-muted">{timeAgo(sub.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .as-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .as-stat {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .as-stat-number {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .as-stat-label {
          font-family: var(--font-display);
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .at-wrapper { overflow-x: auto; background: var(--bg-surface); border-radius: var(--r-lg); border: 1px solid var(--border-sharp); }
        .at-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        .at-table thead { background: var(--grad-card-hover); border-bottom: 1px solid var(--border-sharp); }
        .at-table th { padding: 10px 14px; text-align: left; font-family: var(--font-display); font-weight: 700; font-size: 0.72rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
        .at-table td { padding: 10px 14px; border-bottom: 1px solid var(--border-soft); vertical-align: middle; }
        .at-table tr:last-child td { border-bottom: none; }
        .at-table tbody tr:hover td { background: var(--bg-overlay); }
        .at-cell-sub { font-size: 0.82rem; color: var(--text-body); }
        .at-cell-muted { font-size: 0.76rem; color: var(--text-muted); white-space: nowrap; }
        .at-empty { text-align: center; padding: 36px; color: var(--text-muted); font-family: var(--font-display); font-size: 0.88rem; }
      `}</style>
    </AdminLayout>
  );
};

export default AdminSubscribers;
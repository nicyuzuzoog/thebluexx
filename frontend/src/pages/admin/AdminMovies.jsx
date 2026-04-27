import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoAdd, IoTrash, IoEye, IoSearch, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { getLocalizedText, formatNumber, timeAgo } from '../../utils/helpers';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_COLORS = {
  published: { bg: 'rgba(0,194,111,0.1)', color: 'var(--jade)' },
  pending: { bg: 'rgba(245,158,11,0.1)', color: 'var(--amber)' },
  draft: { bg: 'rgba(113,128,150,0.1)', color: 'var(--ink-400)' },
  rejected: { bg: 'rgba(229,52,74,0.1)', color: 'var(--crimson)' },
};

const AdminMovies = () => {
  const { t, i18n } = useTranslation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchMovies(); }, [filter]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let url = '/admin/movies?limit=20';
      if (filter) url += `&status=${filter}`;
      const res = await api.get(url);
      setMovies(res.data.data);
    } catch (e) { /* */ } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await api.delete(`/movies/${id}`);
      setMovies(prev => prev.filter(m => m._id !== id));
      toast.success('Movie deleted');
    } catch (e) { toast.error('Failed'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/admin/content/movie/${id}/status`, { status });
      setMovies(prev => prev.map(m => m._id === id ? { ...m, status } : m));
      toast.success(`Movie ${status}`);
    } catch (e) { toast.error('Failed'); }
  };

  const filtered = search
    ? movies.filter(m =>
      getLocalizedText(m.title, 'en').toLowerCase().includes(search.toLowerCase())
    )
    : movies;

  return (
    <AdminLayout title={t('admin.manageMovies')}>
      <Helmet><title>{t('admin.manageMovies')} — THE BLUEX</title></Helmet>

      <div className="atb-toolbar">
        <div className="atb-left">
          {['', 'published', 'pending', 'draft', 'rejected'].map((s) => (
            <button key={s}
              className={`filter-pill ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className="atb-right">
          <div className="atb-search">
            <IoSearch className="atb-search-icon" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..." className="atb-search-input" />
          </div>
          <Link to="/admin/movies/create" className="btn btn-primary btn-sm">
            <IoAdd /> {t('admin.createMovie')}
          </Link>
        </div>
      </div>

      <div className="at-wrapper">
        <table className="at-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Status</th>
              <th>Views</th>
              <th>Downloads</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j}><div className="skeleton skeleton-text"></div></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="at-empty">No movies found</td></tr>
            ) : (
              filtered.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="at-cell-title">
                      {getLocalizedText(item.title, i18n.language)}
                    </div>
                  </td>
                  <td className="at-cell-sub" style={{ fontSize: '0.78rem' }}>
                    {item.genre?.slice(0, 2).join(', ')}
                  </td>
                  <td>
                    <span className="at-status-tag" style={{
                      background: STATUS_COLORS[item.status]?.bg,
                      color: STATUS_COLORS[item.status]?.color,
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td className="at-cell-sub">{formatNumber(item.views)}</td>
                  <td className="at-cell-sub">{formatNumber(item.downloads)}</td>
                  <td className="at-cell-muted">{timeAgo(item.createdAt)}</td>
                  <td>
                    <div className="at-actions">
                      {item.status === 'pending' && (<>
                        <button className="at-btn at-btn-green" title="Approve"
                          onClick={() => handleStatus(item._id, 'published')}>
                          <IoCheckmarkCircle />
                        </button>
                        <button className="at-btn at-btn-red" title="Reject"
                          onClick={() => handleStatus(item._id, 'rejected')}>
                          <IoCloseCircle />
                        </button>
                      </>)}
                      {item.status === 'published' && (
                        <Link to={`/movies/${item.slug}`} target="_blank"
                          className="at-btn at-btn-blue" title="View">
                          <IoEye />
                        </Link>
                      )}
                      <button className="at-btn at-btn-red" title="Delete"
                        onClick={() => handleDelete(item._id)}>
                        <IoTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .atb-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .atb-left { display: flex; gap: 5px; flex-wrap: wrap; }
        .atb-right { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .atb-search { position: relative; display: flex; align-items: center; }
        .atb-search-icon { position: absolute; left: 10px; color: var(--text-muted); font-size: 0.95rem; pointer-events: none; }
        .atb-search-input { padding: 7px 12px 7px 32px; border: 1.5px solid var(--border-sharp); border-radius: var(--r-md); font-size: 0.82rem; font-family: var(--font-body); background: var(--bg-surface); color: var(--text-primary); width: 210px; transition: border-color var(--dur-fast), box-shadow var(--dur-fast); }
        .atb-search-input:focus { border-color: var(--cobalt); box-shadow: 0 0 0 3px rgba(27,79,255,0.1); outline: none; }
        .atb-search-input::placeholder { color: var(--text-faint); }
        .filter-pill { padding: 5px 12px; border-radius: var(--r-full); background: var(--bg-overlay); color: var(--text-body); font-family: var(--font-display); font-size: 0.76rem; font-weight: 600; cursor: pointer; transition: all var(--dur-fast) var(--ease-out); border: 1px solid transparent; }
        .filter-pill:hover { background: var(--cobalt-xpale); color: var(--cobalt); }
        .filter-pill.active { background: var(--grad-cobalt); color: var(--white); box-shadow: var(--shadow-cobalt); }
        [data-theme="dark"] .filter-pill:hover { background: rgba(27,79,255,0.1); color: var(--cobalt-light); }
        .at-wrapper { overflow-x: auto; background: var(--bg-surface); border-radius: var(--r-lg); border: 1px solid var(--border-sharp); }
        .at-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        .at-table thead { background: var(--grad-card-hover); border-bottom: 1px solid var(--border-sharp); }
        .at-table th { padding: 10px 14px; text-align: left; font-family: var(--font-display); font-weight: 700; font-size: 0.72rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
        .at-table td { padding: 10px 14px; border-bottom: 1px solid var(--border-soft); vertical-align: middle; }
        .at-table tr:last-child td { border-bottom: none; }
        .at-table tbody tr:hover td { background: var(--bg-overlay); }
        .at-cell-title { font-family: var(--font-display); font-weight: 600; font-size: 0.84rem; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.01em; }
        .at-cell-sub { font-size: 0.82rem; color: var(--text-body); }
        .at-cell-muted { font-size: 0.76rem; color: var(--text-muted); white-space: nowrap; }
        .at-status-tag { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: var(--r-full); font-family: var(--font-display); font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
        .at-empty { text-align: center; padding: 36px; color: var(--text-muted); font-family: var(--font-display); font-size: 0.88rem; }
        .at-actions { display: flex; gap: 4px; align-items: center; }
        .at-btn { width: 28px; height: 28px; border-radius: var(--r-sm); display: inline-flex; align-items: center; justify-content: center; font-size: 0.92rem; cursor: pointer; border: none; transition: all var(--dur-fast) var(--ease-out); text-decoration: none; }
        .at-btn:hover { transform: scale(1.08); }
        .at-btn-blue { background: rgba(27,79,255,0.08); color: var(--cobalt); }
        .at-btn-green { background: rgba(0,194,111,0.08); color: var(--jade); }
        .at-btn-red { background: rgba(229,52,74,0.08); color: var(--crimson); }
        @media (max-width: 768px) { .atb-toolbar { flex-direction: column; } .atb-right { width: 100%; } .atb-search-input { width: 100%; } }
      `}</style>
    </AdminLayout>
  );
};

export default AdminMovies;
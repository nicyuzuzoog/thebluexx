import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoPersonAdd, IoTrash, IoSearch, IoCheckmark, IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { timeAgo } from '../../utils/helpers';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAddPublisher, setShowAddPublisher] = useState(false);
  const [newPublisher, setNewPublisher] = useState({ name: '', email: '', password: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = '/admin/users?limit=50';
      if (roleFilter) url += `&role=${roleFilter}`;
      const res = await api.get(url);
      setUsers(res.data.data);
    } catch (e) { /* */ } finally { setLoading(false); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? res.data.data : u));
      toast.success('Status updated');
    } catch (e) { toast.error('Failed'); }
  };

  const handleRole = async (id, role) => {
    try {
      const res = await api.put(`/admin/users/${id}/role`, { role });
      setUsers(prev => prev.map(u => u._id === id ? res.data.data : u));
      toast.success('Role updated');
    } catch (e) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (e) { toast.error('Failed'); }
  };

  const handleAddPublisher = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await api.post('/admin/publishers', newPublisher);
      setUsers(prev => [res.data.data, ...prev]);
      setNewPublisher({ name: '', email: '', password: '' });
      setShowAddPublisher(false);
      toast.success('Publisher created!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setAdding(false); }
  };

  const ROLE_COLORS = {
    admin: { bg: 'rgba(229,52,74,0.08)', color: 'var(--crimson)' },
    publisher: { bg: 'rgba(27,79,255,0.08)', color: 'var(--cobalt)' },
    user: { bg: 'rgba(113,128,150,0.08)', color: 'var(--ink-400)' },
  };

  const filtered = search
    ? users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    : users;

  return (
    <AdminLayout title={t('admin.manageUsers')}>
      <Helmet><title>{t('admin.manageUsers')} — THE BLUEX</title></Helmet>

      <div className="atb-toolbar">
        <div className="atb-left">
          {['', 'admin', 'publisher', 'user'].map((r) => (
            <button key={r}
              className={`filter-pill ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}>
              {r || 'All'}
            </button>
          ))}
        </div>
        <div className="atb-right">
          <div className="atb-search">
            <IoSearch className="atb-search-icon" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..." className="atb-search-input" />
          </div>
          <button className="btn btn-primary btn-sm"
            onClick={() => setShowAddPublisher(!showAddPublisher)}>
            <IoPersonAdd /> {t('admin.addPublisher')}
          </button>
        </div>
      </div>

      {/* Add Publisher Form */}
      {showAddPublisher && (
        <div className="au-add-form animate-fadeInDown">
          <h3 className="au-add-title"><IoPersonAdd /> {t('admin.addPublisher')}</h3>
          <form onSubmit={handleAddPublisher}>
            <div className="au-form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Name</label>
                <input type="text" className="form-input"
                  value={newPublisher.name}
                  onChange={(e) => setNewPublisher({ ...newPublisher, name: e.target.value })}
                  placeholder="Publisher Name" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email</label>
                <input type="email" className="form-input"
                  value={newPublisher.email}
                  onChange={(e) => setNewPublisher({ ...newPublisher, email: e.target.value })}
                  placeholder="email@example.com" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password</label>
                <input type="text" className="form-input"
                  value={newPublisher.password}
                  onChange={(e) => setNewPublisher({ ...newPublisher, password: e.target.value })}
                  placeholder="Min 6 chars" required minLength={6} />
              </div>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={adding}
                  style={{ height: '42px' }}>
                  {adding ? '...' : <><IoCheckmark /> Create</>}
                </button>
                <button type="button" className="btn btn-ghost" style={{ height: '42px' }}
                  onClick={() => setShowAddPublisher(false)}>
                  <IoClose />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="at-wrapper">
        <table className="at-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
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
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="at-empty">No users found</td></tr>
            ) : (
              filtered.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div className="avatar avatar-sm">
                        {user.avatar
                          ? <img src={user.avatar} alt="" />
                          : <div className="avatar-placeholder" style={{ fontSize: '0.62rem' }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        }
                      </div>
                      <span className="at-cell-title" style={{ maxWidth: '130px' }}>
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="at-cell-sub" style={{ fontSize: '0.78rem' }}>
                    {user.email}
                  </td>
                  <td>
                    <select value={user.role}
                      onChange={(e) => handleRole(user._id, e.target.value)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--r-sm)',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        border: 'none',
                        background: ROLE_COLORS[user.role]?.bg,
                        color: ROLE_COLORS[user.role]?.color,
                        cursor: 'pointer',
                      }}>
                      <option value="user">user</option>
                      <option value="publisher">publisher</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleToggle(user._id)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: 'var(--r-full)',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: 'none',
                        background: user.isActive
                          ? 'rgba(0,194,111,0.08)'
                          : 'rgba(229,52,74,0.08)',
                        color: user.isActive ? 'var(--jade)' : 'var(--crimson)',
                        transition: 'all var(--dur-fast)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="at-cell-muted">{timeAgo(user.createdAt)}</td>
                  <td>
                    <button className="at-btn at-btn-red" title="Delete"
                      onClick={() => handleDelete(user._id)}>
                      <IoTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .au-add-form {
          background: var(--bg-surface);
          border: 1px solid var(--border-sharp);
          border-radius: var(--r-lg);
          padding: 18px;
          margin-bottom: 16px;
        }
        .au-add-title {
          font-family: var(--font-display);
          font-size: 0.92rem;
          font-weight: 700;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 7px;
          letter-spacing: -0.01em;
        }
        .au-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 12px;
          align-items: end;
        }

        /* Shared admin table + toolbar styles */
        .atb-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .atb-left { display: flex; gap: 5px; flex-wrap: wrap; }
        .atb-right { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .atb-search { position: relative; display: flex; align-items: center; }
        .atb-search-icon { position: absolute; left: 10px; color: var(--text-muted); font-size: 0.95rem; pointer-events: none; }
        .atb-search-input { padding: 7px 12px 7px 32px; border: 1.5px solid var(--border-sharp); border-radius: var(--r-md); font-size: 0.82rem; font-family: var(--font-body); background: var(--bg-surface); color: var(--text-primary); width: 200px; transition: border-color var(--dur-fast); }
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
        .at-cell-title { font-family: var(--font-display); font-weight: 600; font-size: 0.84rem; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.01em; }
        .at-cell-sub { font-size: 0.82rem; color: var(--text-body); }
        .at-cell-muted { font-size: 0.76rem; color: var(--text-muted); white-space: nowrap; }
        .at-empty { text-align: center; padding: 36px; color: var(--text-muted); font-family: var(--font-display); font-size: 0.88rem; }
        .at-actions { display: flex; gap: 4px; align-items: center; }
        .at-btn { width: 28px; height: 28px; border-radius: var(--r-sm); display: inline-flex; align-items: center; justify-content: center; font-size: 0.92rem; cursor: pointer; border: none; transition: all var(--dur-fast) var(--ease-out); text-decoration: none; }
        .at-btn:hover { transform: scale(1.08); }
        .at-btn-blue { background: rgba(27,79,255,0.08); color: var(--cobalt); }
        .at-btn-green { background: rgba(0,194,111,0.08); color: var(--jade); }
        .at-btn-red { background: rgba(229,52,74,0.08); color: var(--crimson); }

        @media (max-width: 768px) {
          .atb-toolbar { flex-direction: column; }
          .atb-right { width: 100%; }
          .atb-search-input { width: 100%; }
          .au-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminUsers;
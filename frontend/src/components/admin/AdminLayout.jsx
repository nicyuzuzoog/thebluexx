import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  IoHome, IoNewspaper, IoFilm, IoPeople, IoMegaphone,
  IoBriefcase, IoBookmarks, IoNotifications, IoMenu,
  IoClose, IoLogOut, IoChevronForward, IoStatsChart,
  IoCheckmarkCircle, IoSettingsSharp
} from 'react-icons/io5';
import { FaUserShield } from 'react-icons/fa';

const AdminLayout = ({ children, title }) => {
  const { t } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      path: '/admin',
      label: t('admin.overview'),
      icon: <IoStatsChart />,
      exact: true
    },
    {
      path: '/admin/news',
      label: t('admin.manageNews'),
      icon: <IoNewspaper />
    },
    {
      path: '/admin/movies',
      label: t('admin.manageMovies'),
      icon: <IoFilm />
    },
    ...(isAdmin ? [{
      path: '/admin/users',
      label: t('admin.manageUsers'),
      icon: <IoPeople />
    }] : []),
    {
      path: '/admin/pending',
      label: t('admin.pendingContent'),
      icon: <IoCheckmarkCircle />
    },
    ...(isAdmin ? [
      { path: '/admin/ads', label: t('admin.manageAds'), icon: <IoMegaphone /> },
      { path: '/admin/jobs', label: t('admin.manageJobs'), icon: <IoBriefcase /> },
      { path: '/admin/subscribers', label: t('admin.subscribers'), icon: <IoNotifications /> },
    ] : []),
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="al-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="al-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`al-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="al-sidebar-header">
          <Link to="/admin" className="al-sidebar-logo"
            onClick={() => setSidebarOpen(false)}>
            <div className="al-logo-icon"><span>B</span></div>
            <div className="al-logo-text">
              <span className="al-logo-sub">Admin Panel</span>
              <span className="gradient-text al-logo-main">THE BLUEX</span>
            </div>
          </Link>
          <button className="al-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <IoClose />
          </button>
        </div>

        {/* User info */}
        <div className="al-sidebar-user">
          <div className="avatar" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} />
              : <div className="avatar-placeholder" style={{ fontSize: '0.78rem' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            }
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p className="al-user-name">{user?.name}</p>
            <p className="al-user-role">{user?.role}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="al-sidebar-nav">
          <p className="al-nav-section-label">Management</p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`al-nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="al-nav-icon">{item.icon}</span>
              <span className="al-nav-label">{item.label}</span>
              <IoChevronForward className="al-nav-arrow" />
            </Link>
          ))}

          <p className="al-nav-section-label" style={{ marginTop: '8px' }}>Site</p>
          <Link to="/" className="al-nav-item" onClick={() => setSidebarOpen(false)}>
            <span className="al-nav-icon"><IoHome /></span>
            <span className="al-nav-label">{t('nav.home')}</span>
          </Link>
          <button className="al-nav-item al-logout" onClick={handleLogout}>
            <span className="al-nav-icon"><IoLogOut /></span>
            <span className="al-nav-label">{t('nav.logout')}</span>
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="al-main">
        {/* Header */}
        <header className="al-header">
          <div className="al-header-left">
            <button className="al-menu-toggle" onClick={() => setSidebarOpen(true)}>
              <IoMenu />
            </button>
            <div>
              <h1 className="al-page-title">{title}</h1>
            </div>
          </div>
          <div className="al-header-right">
            <Link to="/admin/pending" className="al-header-btn" title="Pending Content">
              <IoCheckmarkCircle />
            </Link>
            <Link to="/" className="al-header-btn" title="View Site">
              <IoHome />
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="al-content">
          {children}
        </div>
      </div>

      <style>{`
        /* Hide main footer on admin pages */
        

        /* ---- Sidebar ---- */
        .al-sidebar {
          width: 256px;
          background: var(--bg-surface);
          border-right: 1px solid var(--border-sharp);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 600;
          transition: transform var(--dur-mid) var(--ease-out);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .al-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-soft);
          background: var(--grad-card-hover);
          min-height: 64px;
        }

        .al-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .al-logo-icon {
          width: 36px; height: 36px;
          border-radius: var(--r-md);
          background: var(--grad-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--white);
          flex-shrink: 0;
        }
        .al-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .al-logo-sub {
          font-family: var(--font-display);
          font-size: 0.58rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .al-logo-main {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .al-sidebar-close {
          display: none;
          width: 30px; height: 30px;
          border-radius: 50%;
          background: var(--bg-overlay);
          color: var(--text-body);
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          border: none;
          flex-shrink: 0;
        }

        .al-sidebar-user {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-soft);
        }
        .al-user-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.86rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .al-user-role {
          font-family: var(--font-display);
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .al-sidebar-nav {
          flex: 1;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .al-nav-section-label {
          font-family: var(--font-display);
          font-size: 0.64rem;
          font-weight: 700;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 8px 12px 4px;
        }

        .al-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: var(--r-md);
          color: var(--text-body);
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          transition: all var(--dur-fast) var(--ease-out);
          letter-spacing: -0.01em;
        }
        .al-nav-item:hover {
          background: var(--bg-overlay);
          color: var(--cobalt);
          padding-left: 16px;
        }
        .al-nav-item.active {
          background: var(--cobalt-xpale);
          color: var(--cobalt);
          border-left: 2px solid var(--cobalt);
          font-weight: 700;
        }
        [data-theme="dark"] .al-nav-item.active {
          background: rgba(27,79,255,0.1);
        }
        [data-theme="dark"] .al-nav-item:hover {
          background: rgba(27,79,255,0.06);
        }

        .al-nav-icon {
          font-size: 1.05rem;
          flex-shrink: 0;
          display: flex;
        }
        .al-nav-label { flex: 1; }
        .al-nav-arrow {
          font-size: 0.62rem;
          opacity: 0;
          transition: opacity var(--dur-fast);
        }
        .al-nav-item:hover .al-nav-arrow,
        .al-nav-item.active .al-nav-arrow { opacity: 1; }

        .al-logout:hover { color: var(--crimson) !important; }

        /* ---- Overlay ---- */
        .al-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7,11,20,0.52);
          z-index: 599;
          animation: fadeIn 0.22s var(--ease-out);
        }

        /* ---- Main Area ---- */
        .al-main {
          flex: 1;
          margin-left: 256px;
          min-height: 100vh;
          background: var(--bg-base);
          display: flex;
          flex-direction: column;
        }

        .al-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 26px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-sharp);
          position: sticky;
          top: 0;
          z-index: 100;
          min-height: 60px;
        }
        .al-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .al-menu-toggle {
          display: none;
          width: 36px; height: 36px;
          border-radius: var(--r-md);
          background: var(--bg-overlay);
          color: var(--text-body);
          font-size: 1.25rem;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          flex-shrink: 0;
        }
        .al-page-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .al-header-right { display: flex; gap: 7px; }
        .al-header-btn {
          width: 36px; height: 36px;
          border-radius: var(--r-md);
          background: var(--bg-overlay);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          transition: all var(--dur-fast) var(--ease-out);
          border: 1px solid var(--border-soft);
        }
        .al-header-btn:hover {
          background: var(--cobalt);
          color: var(--white);
          border-color: transparent;
        }

        .al-content {
          padding: 22px 26px;
          flex: 1;
        }

        /* ---- Responsive ---- */
        @media (max-width: 1024px) {
          .al-sidebar {
            transform: translateX(-100%);
          }
          .al-sidebar.open {
            transform: translateX(0);
            box-shadow: var(--shadow-2xl);
          }
          .al-sidebar-close { display: flex; }
          .al-main { margin-left: 0; }
          .al-menu-toggle { display: flex; }
        }

        @media (max-width: 768px) {
          .al-content { padding: 14px 14px; }
          .al-header { padding: 10px 14px; }
          .al-page-title { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
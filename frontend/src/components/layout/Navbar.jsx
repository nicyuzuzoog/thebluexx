import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  IoSearch, IoClose, IoMenu, IoChevronDown,
  IoSunny, IoMoon, IoNewspaper, IoFilm,
  IoHome, IoBriefcase, IoBookmarks,
  IoPerson, IoLogOut, IoGlobe
} from 'react-icons/io5';
import { FaUserShield } from 'react-icons/fa';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, isAdmin, isPublisher, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const langRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setLangOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/news?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const languageNames = {
    en: { name: 'English', flag: '🇬🇧' },
    fr: { name: 'Français', flag: '🇫🇷' },
    rw: { name: 'Kinyarwanda', flag: '🇷🇼' }
  };

  const currentLang = languageNames[i18n.language] || languageNames.en;

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: <IoHome /> },
    { path: '/news', label: t('nav.news'), icon: <IoNewspaper /> },
    { path: '/movies', label: t('nav.movies'), icon: <IoFilm /> },
    { path: '/jobs', label: t('nav.jobs'), icon: <IoBriefcase /> },
    { path: '/stories', label: t('nav.stories'), icon: <IoBookmarks /> },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        {/* Top bar */}
        <div className="navbar-top">
          <div className="container navbar-top-inner">
            <div className="navbar-top-left">
              <span className="navbar-top-text">📧 thebluex08@gmail.com</span>
              <span className="navbar-top-divider">|</span>
              <span className="navbar-top-text">🇷🇼 Rwanda</span>
            </div>
            <div className="navbar-top-right">
              <div className="lang-switcher" ref={langRef}>
                <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                  <IoGlobe />
                  <span>{currentLang.flag} {currentLang.name}</span>
                  <IoChevronDown className={`lang-arrow ${langOpen ? 'rotated' : ''}`} />
                </button>
                <div className={`lang-dropdown ${langOpen ? 'active' : ''}`}>
                  {Object.entries(languageNames).map(([code, lang]) => (
                    <button
                      key={code}
                      className={`lang-option ${i18n.language === code ? 'active' : ''}`}
                      onClick={() => changeLanguage(code)}
                    >
                      <span className="lang-flag">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button className="theme-toggle" onClick={toggleDarkMode}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                {darkMode ? <IoSunny /> : <IoMoon />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="navbar-main">
          <div className="container navbar-main-inner">
            <Link to="/" className="navbar-logo">
              <div className="logo-icon"><span>B</span></div>
              <div className="logo-text">
                <span className="logo-the">THE</span>
                <span className="logo-bluex">BLUEX</span>
              </div>
            </Link>

            <div className="navbar-links">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}>
                  <span className="nav-link-icon">{link.icon}</span>
                  <span className="nav-link-text">{link.label}</span>
                  <span className="nav-link-indicator"></span>
                </Link>
              ))}
            </div>

            <div className="navbar-actions">
              <button className="nav-action-btn" onClick={() => setSearchOpen(true)} title="Search">
                <IoSearch />
              </button>

              {isAuthenticated ? (
                <div className="user-menu-wrapper" ref={userRef}>
                  <button className="user-menu-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                    <div className="avatar avatar-sm">
                      {user?.avatar ? <img src={user.avatar} alt={user.name} /> :
                        <div className="avatar-placeholder" style={{ fontSize: '0.7rem' }}>
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>}
                    </div>
                    <span className="user-name-desktop">{user?.name?.split(' ')[0]}</span>
                    <IoChevronDown className={`user-arrow ${userMenuOpen ? 'rotated' : ''}`} />
                  </button>
                  <div className={`user-dropdown ${userMenuOpen ? 'active' : ''}`}>
                    <div className="user-dropdown-header">
                      <div className="avatar">
                        {user?.avatar ? <img src={user.avatar} alt={user.name} /> :
                          <div className="avatar-placeholder">{user?.name?.charAt(0).toUpperCase()}</div>}
                      </div>
                      <div>
                        <p className="user-dropdown-name">{user?.name}</p>
                        <p className="user-dropdown-email">{user?.email}</p>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <Link to="/profile" className="user-dropdown-item">
                      <IoPerson /> {t('nav.profile')}
                    </Link>
                    {(isAdmin || isPublisher) && (
                      <Link to="/admin" className="user-dropdown-item">
                        <FaUserShield /> {t('nav.dashboard')}
                      </Link>
                    )}
                    <div className="user-dropdown-divider"></div>
                    <button className="user-dropdown-item logout" onClick={handleLogout}>
                      <IoLogOut /> {t('nav.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-ghost btn-sm">{t('nav.login')}</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
                </div>
              )}

              <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <IoClose /> : <IoMenu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-overlay-content animate-fadeInDown" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="search-form">
              <IoSearch className="search-form-icon" />
              <input ref={searchRef} type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')} className="search-form-input" />
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>
                <IoClose />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)} />
      <div className={`mobile-sidebar ${mobileOpen ? 'active' : ''}`}>
        <div className="mobile-sidebar-header">
          <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
            <div className="logo-icon"><span>B</span></div>
            <div className="logo-text">
              <span className="logo-the">THE</span>
              <span className="logo-bluex">BLUEX</span>
            </div>
          </Link>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}><IoClose /></button>
        </div>
        <div className="mobile-sidebar-links">
          {navLinks.map((link, index) => (
            <Link key={link.path} to={link.path}
              className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${index * 0.08}s` }}>
              <span className="mobile-link-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
        <div className="mobile-sidebar-footer">
          <div className="mobile-lang">
            {Object.entries(languageNames).map(([code, lang]) => (
              <button key={code}
                className={`mobile-lang-btn ${i18n.language === code ? 'active' : ''}`}
                onClick={() => changeLanguage(code)}>
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
          {!isAuthenticated && (
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}
                onClick={() => setMobileOpen(false)}>{t('nav.login')}</Link>
              <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}
                onClick={() => setMobileOpen(false)}>{t('nav.register')}</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: var(--z-navbar);
          transition: all var(--dur-mid) var(--ease-out);
        }
        .navbar-scrolled {
          box-shadow: 0 4px 24px rgba(7,11,20,0.15);
        }

        /* Top Bar */
        .navbar-top {
          background: var(--grad-navbar);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          padding: 5px 0;
          font-size: 0.76rem;
          color: rgba(255,255,255,0.68);
        }
        .navbar-scrolled .navbar-top { padding: 3px 0; font-size: 0.72rem; }

        .navbar-top-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-top-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .navbar-top-text {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .navbar-top-divider { opacity: 0.25; }
        .navbar-top-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Language */
        .lang-switcher { position: relative; }
        .lang-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 3px 11px;
          border-radius: var(--r-full);
          color: rgba(255,255,255,0.78);
          font-size: 0.76rem;
          font-family: var(--font-display);
          cursor: pointer;
          transition: all var(--dur-fast) var(--ease-out);
        }
        .lang-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.15);
        }
        .lang-arrow {
          font-size: 0.65rem;
          transition: transform var(--dur-fast) var(--ease-out);
        }
        .lang-arrow.rotated { transform: rotate(180deg); }

        .lang-dropdown {
          position: absolute;
          top: 100%; right: 0;
          margin-top: 6px;
          background: var(--bg-raised);
          border-radius: var(--r-md);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-sharp);
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px) scale(0.96);
          transition: all var(--dur-mid) var(--ease-spring);
          min-width: 155px;
          z-index: 10;
        }
        .lang-dropdown.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .lang-option {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 15px;
          width: 100%;
          background: none;
          border: none;
          color: var(--text-body);
          font-size: 0.85rem;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all var(--dur-fast) var(--ease-out);
        }
        .lang-option:hover {
          background: var(--bg-overlay);
          color: var(--text-primary);
          padding-left: 20px;
        }
        .lang-option.active {
          background: var(--cobalt-xpale);
          color: var(--cobalt);
          font-weight: 600;
        }
        [data-theme="dark"] .lang-option.active {
          background: rgba(27,79,255,0.12);
          color: var(--cobalt-light);
        }
        .lang-flag { font-size: 1.05rem; }

        /* Theme Toggle */
        .theme-toggle {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.78);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .theme-toggle:hover {
          background: rgba(255,255,255,0.15);
          transform: rotate(180deg);
        }

        /* Main Navbar */
        .navbar-main {
          background: var(--grad-navbar);
          padding: 11px 0;
          transition: all var(--dur-mid) var(--ease-out);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .navbar-scrolled .navbar-main {
          padding: 8px 0;
          backdrop-filter: blur(16px) saturate(180%);
        }
        .navbar-main-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        /* Logo */
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }
        .logo-icon {
          width: 40px; height: 40px;
          border-radius: var(--r-md);
          background: var(--grad-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--white);
          box-shadow: var(--shadow-cobalt);
          transition: all var(--dur-mid) var(--ease-spring);
        }
        .navbar-logo:hover .logo-icon {
          transform: rotate(-5deg) scale(1.06);
          box-shadow: 0 6px 24px rgba(27,79,255,0.5);
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }
        .logo-the {
          font-family: var(--font-display);
          font-size: 0.55rem;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        .logo-bluex {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          background: var(--grad-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        /* Nav Links */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: var(--r-md);
          color: rgba(255,255,255,0.62);
          font-size: 0.88rem;
          font-weight: 600;
          font-family: var(--font-display);
          position: relative;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .nav-link:hover {
          color: var(--white);
          background: rgba(255,255,255,0.06);
        }
        .nav-link.active {
          color: var(--white);
          background: rgba(255,255,255,0.08);
        }
        .nav-link-icon {
          font-size: 1.05rem;
          transition: transform var(--dur-mid) var(--ease-spring);
        }
        .nav-link:hover .nav-link-icon { transform: scale(1.18); }
        .nav-link-indicator {
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 18px; height: 2px;
          background: var(--grad-brand);
          border-radius: var(--r-full);
          transition: transform var(--dur-mid) var(--ease-out);
        }
        .nav-link.active .nav-link-indicator,
        .nav-link:hover .nav-link-indicator {
          transform: translateX(-50%) scaleX(1);
        }

        /* Actions */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-action-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .nav-action-btn:hover {
          background: rgba(255,255,255,0.12);
          color: var(--white);
          transform: scale(1.05);
        }

        /* User Menu */
        .user-menu-wrapper { position: relative; }
        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 3px 11px 3px 3px;
          border-radius: var(--r-full);
          color: var(--white);
          cursor: pointer;
          transition: all var(--dur-fast) var(--ease-out);
          font-family: var(--font-display);
        }
        .user-menu-btn:hover { background: rgba(255,255,255,0.12); }
        .user-name-desktop { font-size: 0.82rem; font-weight: 600; }
        .user-arrow {
          font-size: 0.65rem;
          transition: transform var(--dur-fast) var(--ease-out);
        }
        .user-arrow.rotated { transform: rotate(180deg); }

        .user-dropdown {
          position: absolute;
          top: 100%; right: 0;
          margin-top: 8px;
          background: var(--bg-raised);
          border-radius: var(--r-lg);
          box-shadow: var(--shadow-2xl);
          border: 1px solid var(--border-sharp);
          min-width: 230px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px) scale(0.96);
          transition: all var(--dur-mid) var(--ease-spring);
          z-index: 10;
          overflow: hidden;
        }
        .user-dropdown.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .user-dropdown-header {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 14px 16px;
          background: var(--grad-card-hover);
        }
        .user-dropdown-name {
          font-weight: 600;
          font-size: 0.9rem;
          font-family: var(--font-display);
        }
        .user-dropdown-email {
          font-size: 0.74rem;
          color: var(--text-muted);
        }
        .user-dropdown-divider {
          height: 1px;
          background: var(--border-soft);
        }
        .user-dropdown-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 16px;
          color: var(--text-body);
          font-size: 0.88rem;
          font-family: var(--font-body);
          cursor: pointer;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          transition: all var(--dur-fast) var(--ease-out);
        }
        .user-dropdown-item:hover {
          background: var(--bg-overlay);
          color: var(--cobalt);
          padding-left: 20px;
        }
        .user-dropdown-item.logout:hover { color: var(--crimson); }

        .auth-buttons { display: flex; gap: 7px; }

        /* Mobile Toggle */
        .mobile-toggle {
          display: none;
          width: 38px; height: 38px;
          border-radius: var(--r-md);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--white);
          font-size: 1.35rem;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .mobile-toggle:hover { background: rgba(255,255,255,0.12); }

        /* Search Overlay */
        .search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7,11,20,0.72);
          backdrop-filter: blur(8px);
          z-index: 1001;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 120px;
          animation: fadeIn 0.25s var(--ease-out);
        }
        .search-overlay-content {
          width: 100%;
          max-width: 620px;
          padding: 0 20px;
        }
        .search-form {
          display: flex;
          align-items: center;
          background: var(--bg-raised);
          border-radius: var(--r-xl);
          padding: 5px 5px 5px 18px;
          box-shadow: var(--shadow-2xl);
          border: 2px solid var(--cobalt);
        }
        .search-form-icon {
          font-size: 1.2rem;
          color: var(--cobalt);
          flex-shrink: 0;
        }
        .search-form-input {
          flex: 1;
          padding: 13px 14px;
          font-size: 1.05rem;
          background: transparent;
          color: var(--text-primary);
          border: none;
          font-family: var(--font-body);
        }
        .search-form-input::placeholder { color: var(--text-faint); }
        .search-close {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--bg-overlay);
          color: var(--text-body);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          cursor: pointer;
          flex-shrink: 0;
          transition: all var(--dur-fast) var(--ease-out);
        }
        .search-close:hover {
          background: var(--crimson);
          color: var(--white);
          transform: rotate(90deg);
        }

        /* Mobile Sidebar */
        .mobile-sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7,11,20,0.5);
          z-index: 998;
          opacity: 0;
          visibility: hidden;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .mobile-sidebar-overlay.active { opacity: 1; visibility: visible; }

        .mobile-sidebar {
          position: fixed;
          top: 0; left: -310px;
          width: 290px;
          height: 100vh;
          background: var(--bg-surface);
          z-index: 999;
          transition: left var(--dur-mid) var(--ease-out);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-2xl);
          overflow-y: auto;
        }
        .mobile-sidebar.active { left: 0; }

        .mobile-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-soft);
          background: var(--grad-navbar);
        }
        .mobile-close {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all var(--dur-fast) var(--ease-out);
        }
        .mobile-close:hover {
          background: rgba(255,255,255,0.18);
          transform: rotate(90deg);
        }

        .mobile-sidebar-links {
          flex: 1;
          padding: 14px 10px;
        }
        .mobile-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: var(--r-md);
          color: var(--text-body);
          font-weight: 600;
          font-size: 0.92rem;
          font-family: var(--font-display);
          transition: all var(--dur-mid) var(--ease-out);
          animation: fadeInLeft 0.4s var(--ease-out) both;
        }
        .mobile-link:hover {
          background: var(--bg-overlay);
          color: var(--cobalt);
          padding-left: 22px;
        }
        .mobile-link.active {
          background: var(--cobalt-xpale);
          color: var(--cobalt);
          border-left: 3px solid var(--cobalt);
        }
        [data-theme="dark"] .mobile-link.active {
          background: rgba(27,79,255,0.1);
        }
        .mobile-link-icon { font-size: 1.2rem; }

        .mobile-sidebar-footer {
          padding: 14px 18px;
          border-top: 1px solid var(--border-soft);
        }
        .mobile-lang {
          display: flex;
          gap: 5px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .mobile-lang-btn {
          padding: 5px 12px;
          border-radius: var(--r-full);
          background: var(--bg-overlay);
          color: var(--text-body);
          font-size: 0.78rem;
          font-weight: 600;
          font-family: var(--font-display);
          cursor: pointer;
          transition: all var(--dur-fast) var(--ease-out);
          border: 1px solid transparent;
        }
        .mobile-lang-btn.active {
          background: var(--cobalt-xpale);
          color: var(--cobalt);
          border-color: var(--cobalt);
        }
        [data-theme="dark"] .mobile-lang-btn.active {
          background: rgba(27,79,255,0.12);
          color: var(--cobalt-light);
        }
        .mobile-auth {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        /* Spacer */
        .main-content {
          padding-top: var(--navbar-height);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .navbar-links { display: none; }
          .mobile-toggle { display: flex; }
          .auth-buttons { display: none; }
          .user-name-desktop { display: none; }
        }

        @media (max-width: 768px) {
          .navbar-top-left { display: none; }
          .main-content { padding-top: var(--navbar-height); }
          .logo-icon { width: 34px; height: 34px; font-size: 1.15rem; }
          .logo-bluex { font-size: 1.15rem; }
        }

        @media (max-width: 480px) {
          .navbar-top { padding: 3px 0; }
          .logo-text { display: none; }
          .main-content { padding-top: 85px; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
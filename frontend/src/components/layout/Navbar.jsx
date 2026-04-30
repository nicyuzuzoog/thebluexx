import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getImageUrl } from '../../utils/helpers';
import {
  IoSearch, IoClose, IoMenu, IoChevronDown,
  IoSunny, IoMoon, IoNewspaper, IoFilm,
  IoHome, IoBriefcase, IoBookmarks,
  IoPerson, IoLogOut, IoGlobe, IoNotifications
} from 'react-icons/io5';
import { FaUserShield, FaWhatsapp } from 'react-icons/fa';
import { RiLiveLine } from 'react-icons/ri';

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
  const [hoveredLink, setHoveredLink] = useState(null);
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
    { path: '/', label: t('nav.home'), icon: <IoHome />, color: '#1B4FFF' },
    { path: '/news', label: t('nav.news'), icon: <IoNewspaper />, color: '#00C896' },
    { path: '/movies', label: t('nav.movies'), icon: <IoFilm />, color: '#FF3860' },
    { path: '/jobs', label: t('nav.jobs'), icon: <IoBriefcase />, color: '#FFB800' },
    { path: '/stories', label: t('nav.stories'), icon: <IoBookmarks />, color: '#9B59B6' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const UserAvatar = ({ size = 'normal' }) => (
    <div className={`avatar ${size === 'small' ? 'avatar-sm' : ''}`}>
      {user?.avatar ? (
        <img src={getImageUrl(user.avatar)} alt={user.name} />
      ) : (
        <div className="avatar-placeholder">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>

        {/* ✅ Top Bar */}
        <div className="navbar-top">
          <div className="container navbar-top-inner">
            <div className="navbar-top-left">
              <span className="top-badge live-badge">
                <RiLiveLine className="live-icon" /> LIVE
              </span>
              <span className="navbar-top-text">
                📧 thebluex08@gmail.com
              </span>
              <span className="navbar-top-divider">|</span>
              <span className="navbar-top-text">🇷🇼 Kigali, Rwanda</span>
            </div>
            <div className="navbar-top-right">
              {/* Language Switcher */}
              <div className="lang-switcher" ref={langRef}>
                <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                  <IoGlobe className="lang-globe" />
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
                      {i18n.language === code && <span className="lang-check">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp Quick Contact */}
              <a
                href="https://wa.me/+250780457288?text=Hello THE BLUEX"
                target="_blank"
                rel="noopener noreferrer"
                className="top-wa-btn"
                title="Contact us on WhatsApp"
              >
                <FaWhatsapp /> <span>Chat</span>
              </a>

              {/* Theme Toggle */}
              <button className="theme-toggle" onClick={toggleDarkMode}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                <span className="theme-icon-wrap">
                  {darkMode ? <IoSunny /> : <IoMoon />}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Main Navbar */}
        <div className="navbar-main">
          <div className="container navbar-main-inner">

            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <div className="logo-icon">
                <span>B</span>
                <div className="logo-pulse"></div>
              </div>
              <div className="logo-text">
                <span className="logo-the">THE</span>
                <span className="logo-bluex">BLUEX</span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="navbar-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredLink(link.path)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{
                    '--link-color': link.color,
                  }}
                >
                  <span className="nav-link-icon">{link.icon}</span>
                  <span className="nav-link-text">{link.label}</span>
                  <span className="nav-link-indicator"></span>
                  <span className="nav-link-glow"></span>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="navbar-actions">

              {/* Search Button */}
              <button className="nav-action-btn search-btn" onClick={() => setSearchOpen(true)}
                title="Search">
                <IoSearch />
                <span className="btn-ripple"></span>
              </button>

              {/* Notifications (if logged in) */}
              {isAuthenticated && (
                <button className="nav-action-btn notif-btn" title="Notifications">
                  <IoNotifications />
                  <span className="notif-dot"></span>
                </button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="user-menu-wrapper" ref={userRef}>
                  <button className="user-menu-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}>
                    <UserAvatar size="small" />
                    <span className="user-name-desktop">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <IoChevronDown className={`user-arrow ${userMenuOpen ? 'rotated' : ''}`} />
                  </button>
                  <div className={`user-dropdown ${userMenuOpen ? 'active' : ''}`}>
                    <div className="user-dropdown-header">
                      <UserAvatar />
                      <div>
                        <p className="user-dropdown-name">{user?.name}</p>
                        <p className="user-dropdown-email">{user?.email}</p>
                        <span className="user-role-badge">
                          {isAdmin ? '👑 Admin' : isPublisher ? '✍️ Publisher' : '👤 Member'}
                        </span>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <Link to="/profile" className="user-dropdown-item">
                      <span className="item-icon"><IoPerson /></span>
                      <span>{t('nav.profile')}</span>
                      <span className="item-arrow">›</span>
                    </Link>
                    {(isAdmin || isPublisher) && (
                      <Link to="/admin" className="user-dropdown-item admin-item">
                        <span className="item-icon"><FaUserShield /></span>
                        <span>{t('nav.dashboard')}</span>
                        <span className="item-arrow">›</span>
                      </Link>
                    )}
                    <div className="user-dropdown-divider"></div>
                    <button className="user-dropdown-item logout" onClick={handleLogout}>
                      <span className="item-icon"><IoLogOut /></span>
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn-login">{t('nav.login')}</Link>
                  <Link to="/register" className="btn-register">{t('nav.register')}</Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                <span className={`hamburger ${mobileOpen ? 'open' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Search Overlay */}
      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-overlay-content animate-fadeInDown"
            onClick={e => e.stopPropagation()}>
            <p className="search-hint">Search news, movies, stories...</p>
            <form onSubmit={handleSearch} className="search-form">
              <IoSearch className="search-form-icon" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="search-form-input"
              />
              {searchQuery && (
                <button type="button" className="search-clear"
                  onClick={() => setSearchQuery('')}>
                  <IoClose />
                </button>
              )}
              <button type="submit" className="search-submit">
                Search
              </button>
            </form>
            <button className="search-close-btn" onClick={() => setSearchOpen(false)}>
              <IoClose /> Press ESC to close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Mobile Sidebar */}
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
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <IoClose />
          </button>
        </div>

        {/* User info on mobile */}
        {isAuthenticated && (
          <div className="mobile-user-info">
            <UserAvatar />
            <div>
              <p className="mobile-user-name">{user?.name}</p>
              <p className="mobile-user-email">{user?.email}</p>
            </div>
          </div>
        )}

        <div className="mobile-sidebar-links">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${index * 0.07}s`, '--link-color': link.color }}
            >
              <span className="mobile-link-icon" style={{ color: link.color }}>
                {link.icon}
              </span>
              <span>{link.label}</span>
              {isActive(link.path) && <span className="mobile-active-dot"></span>}
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <div className="mobile-divider"></div>
              <Link to="/profile" className="mobile-link"
                onClick={() => setMobileOpen(false)}>
                <span className="mobile-link-icon"><IoPerson /></span>
                <span>{t('nav.profile')}</span>
              </Link>
              {(isAdmin || isPublisher) && (
                <Link to="/admin" className="mobile-link"
                  onClick={() => setMobileOpen(false)}>
                  <span className="mobile-link-icon"><FaUserShield /></span>
                  <span>{t('nav.dashboard')}</span>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="mobile-sidebar-footer">
          <div className="mobile-lang">
            {Object.entries(languageNames).map(([code, lang]) => (
              <button
                key={code}
                className={`mobile-lang-btn ${i18n.language === code ? 'active' : ''}`}
                onClick={() => changeLanguage(code)}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>

          {!isAuthenticated ? (
            <div className="mobile-auth">
              <Link to="/login" className="btn-login"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={() => setMobileOpen(false)}>
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-register"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={() => setMobileOpen(false)}>
                {t('nav.register')}
              </Link>
            </div>
          ) : (
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <IoLogOut /> {t('nav.logout')}
            </button>
          )}
        </div>
      </div>

      <style>{`
        /* ===== BASE ===== */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: var(--z-navbar);
          transition: all 0.3s ease;
        }
        .navbar-scrolled {
          filter: drop-shadow(0 4px 24px rgba(7,11,20,0.25));
        }

        /* ===== TOP BAR ===== */
        .navbar-top {
          background: linear-gradient(135deg, #070C16 0%, #0D1424 50%, #0A1918 100%);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 5px 0;
          font-size: 0.76rem;
          color: rgba(255,255,255,0.68);
        }
        .navbar-top-inner {
          display: flex; align-items: center; justify-content: space-between;
        }
        .navbar-top-left {
          display: flex; align-items: center; gap: 12px;
        }
        .navbar-top-right {
          display: flex; align-items: center; gap: 10px;
        }
        .navbar-top-divider { opacity: 0.25; }
        .navbar-top-text {
          display: flex; align-items: center; gap: 4px;
          transition: color 0.2s;
        }
        .navbar-top-text:hover { color: rgba(255,255,255,0.9); }

        /* Live Badge */
        .live-badge {
          display: flex; align-items: center; gap: 4px;
          background: rgba(255,56,96,0.15);
          border: 1px solid rgba(255,56,96,0.3);
          color: #FF3860;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 1px;
          animation: livePulse 2s infinite;
        }
        .live-icon {
          font-size: 0.8rem;
          animation: blink 1s infinite;
        }
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,56,96,0.3); }
          50% { box-shadow: 0 0 0 4px rgba(255,56,96,0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* WhatsApp Button */
        .top-wa-btn {
          display: flex; align-items: center; gap: 5px;
          background: rgba(37,211,102,0.12);
          border: 1px solid rgba(37,211,102,0.25);
          color: #25D366;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.74rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .top-wa-btn:hover {
          background: rgba(37,211,102,0.22);
          transform: scale(1.05);
          color: #25D366;
        }

        /* Language Switcher */
        .lang-switcher { position: relative; }
        .lang-btn {
          display: flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 3px 11px;
          border-radius: 20px;
          color: rgba(255,255,255,0.78);
          font-size: 0.76rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lang-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.2);
          color: white;
        }
        .lang-globe { color: #1B4FFF; font-size: 0.9rem; }
        .lang-arrow {
          font-size: 0.65rem;
          transition: transform 0.2s ease;
        }
        .lang-arrow.rotated { transform: rotate(180deg); }
        .lang-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: var(--bg-raised, #111827);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
          opacity: 0; visibility: hidden;
          transform: translateY(-8px) scale(0.95);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          min-width: 160px; z-index: 100;
        }
        .lang-dropdown.active {
          opacity: 1; visibility: visible;
          transform: translateY(0) scale(1);
        }
        .lang-option {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 16px; width: 100%;
          background: none; border: none;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem; cursor: pointer;
          transition: all 0.2s ease;
          justify-content: space-between;
        }
        .lang-option:hover {
          background: rgba(255,255,255,0.06);
          color: white;
          padding-left: 20px;
        }
        .lang-option.active {
          background: rgba(27,79,255,0.15);
          color: #6B9FFF;
        }
        .lang-check { color: #00C896; font-weight: 700; }
        .lang-flag { font-size: 1.1rem; }

        /* Theme Toggle */
        .theme-toggle {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.78);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem; cursor: pointer;
          transition: all 0.3s ease;
          position: relative; overflow: hidden;
        }
        .theme-toggle:hover {
          background: rgba(255,200,0,0.15);
          border-color: rgba(255,200,0,0.3);
          color: #FFB800;
          transform: rotate(20deg) scale(1.1);
        }

        /* ===== MAIN NAVBAR ===== */
        .navbar-main {
          background: linear-gradient(135deg, #070C16 0%, #0D1424 50%, #0A1918 100%);
          padding: 11px 0;
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
        }
        .navbar-scrolled .navbar-main {
          padding: 7px 0;
          background: rgba(7,12,22,0.95);
        }
        .navbar-main-inner {
          display: flex; align-items: center;
          justify-content: space-between; gap: 18px;
        }

        /* ===== LOGO ===== */
        .navbar-logo {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
          text-decoration: none;
        }
        .logo-icon {
          width: 42px; height: 42px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1B4FFF, #00C896);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; font-weight: 800;
          color: white;
          box-shadow: 0 4px 20px rgba(27,79,255,0.4);
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; overflow: hidden;
        }
        .logo-pulse {
          position: absolute; inset: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, #1B4FFF, #00C896);
          opacity: 0;
          transition: all 0.3s ease;
        }
        .navbar-logo:hover .logo-icon {
          transform: rotate(-8deg) scale(1.1);
          box-shadow: 0 8px 30px rgba(27,79,255,0.6);
        }
        .logo-text {
          display: flex; flex-direction: column; line-height: 1.05;
        }
        .logo-the {
          font-size: 0.52rem; font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase; letter-spacing: 3.5px;
        }
        .logo-bluex {
          font-size: 1.4rem; font-weight: 900;
          background: linear-gradient(135deg, #6B9FFF, #00C896);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
          transition: all 0.3s ease;
        }
        .navbar-logo:hover .logo-bluex {
          background: linear-gradient(135deg, #ffffff, #00C896);
          -webkit-background-clip: text;
        }

        /* ===== NAV LINKS ===== */
        .navbar-links {
          display: flex; align-items: center; gap: 2px;
        }
        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          color: rgba(255,255,255,0.6);
          font-size: 0.88rem; font-weight: 600;
          position: relative; overflow: hidden;
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .nav-link::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--link-color, #1B4FFF);
          opacity: 0;
          transition: opacity 0.25s ease;
          border-radius: 10px;
        }
        .nav-link:hover::before { opacity: 0.1; }
        .nav-link.active::before { opacity: 0.12; }
        .nav-link:hover {
          color: white;
          transform: translateY(-1px);
        }
        .nav-link.active { color: white; }
        .nav-link-icon {
          font-size: 1.1rem;
          color: var(--link-color, #1B4FFF);
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; z-index: 1;
        }
        .nav-link:hover .nav-link-icon {
          transform: scale(1.25) rotate(-5deg);
        }
        .nav-link-text { position: relative; z-index: 1; }
        .nav-link-indicator {
          position: absolute; bottom: 0; left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 24px; height: 2.5px;
          background: var(--link-color, #1B4FFF);
          border-radius: 10px;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .nav-link.active .nav-link-indicator,
        .nav-link:hover .nav-link-indicator {
          transform: translateX(-50%) scaleX(1);
        }

        /* ===== ACTIONS ===== */
        .navbar-actions {
          display: flex; align-items: center; gap: 8px;
        }
        .nav-action-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.72);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.15rem; cursor: pointer;
          transition: all 0.25s ease;
          position: relative; overflow: hidden;
        }
        .nav-action-btn:hover {
          background: rgba(255,255,255,0.12);
          color: white;
          transform: scale(1.08);
          border-color: rgba(255,255,255,0.2);
        }
        .search-btn:hover {
          background: rgba(27,79,255,0.15);
          border-color: rgba(27,79,255,0.3);
          color: #6B9FFF;
        }

        /* Notification dot */
        .notif-btn { position: relative; }
        .notif-dot {
          position: absolute; top: 6px; right: 6px;
          width: 8px; height: 8px;
          background: #FF3860;
          border-radius: 50%;
          border: 2px solid #070C16;
          animation: notifPulse 2s infinite;
        }
        @keyframes notifPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        /* ===== USER MENU ===== */
        .user-menu-wrapper { position: relative; }
        .user-menu-btn {
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 12px 4px 4px;
          border-radius: 50px;
          color: white; cursor: pointer;
          transition: all 0.25s ease;
        }
        .user-menu-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(27,79,255,0.4);
          box-shadow: 0 0 0 3px rgba(27,79,255,0.1);
        }
        .user-name-desktop {
          font-size: 0.84rem; font-weight: 600;
          max-width: 80px; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
        }
        .user-arrow {
          font-size: 0.7rem;
          transition: transform 0.25s ease;
          color: rgba(255,255,255,0.5);
        }
        .user-arrow.rotated { transform: rotate(180deg); }
        .user-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: var(--bg-raised, #111827);
          border-radius: 16px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.08);
          min-width: 240px;
          opacity: 0; visibility: hidden;
          transform: translateY(-10px) scale(0.95);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          z-index: 100; overflow: hidden;
        }
        .user-dropdown.active {
          opacity: 1; visibility: visible;
          transform: translateY(0) scale(1);
        }
        .user-dropdown-header {
          display: flex; align-items: center; gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(27,79,255,0.1), rgba(0,200,150,0.05));
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .user-dropdown-name {
          font-weight: 700; font-size: 0.92rem; color: white;
        }
        .user-dropdown-email {
          font-size: 0.74rem; color: rgba(255,255,255,0.45);
          margin-top: 2px;
        }
        .user-role-badge {
          display: inline-block;
          margin-top: 4px;
          font-size: 0.68rem;
          background: rgba(27,79,255,0.15);
          color: #6B9FFF;
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid rgba(27,79,255,0.2);
        }
        .user-dropdown-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
        }
        .user-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; width: 100%;
          background: none; border: none;
          color: rgba(255,255,255,0.7);
          font-size: 0.88rem; cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .user-dropdown-item:hover {
          background: rgba(255,255,255,0.05);
          color: white; padding-left: 22px;
        }
        .item-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .user-dropdown-item:hover .item-icon {
          background: rgba(27,79,255,0.15);
          color: #6B9FFF;
        }
        .admin-item:hover .item-icon {
          background: rgba(255,184,0,0.15);
          color: #FFB800;
        }
        .item-arrow {
          margin-left: auto;
          color: rgba(255,255,255,0.25);
          font-size: 1.1rem;
          transition: all 0.2s ease;
        }
        .user-dropdown-item:hover .item-arrow {
          color: rgba(255,255,255,0.6);
          transform: translateX(3px);
        }
        .user-dropdown-item.logout:hover {
          background: rgba(255,56,96,0.08);
          color: #FF3860;
        }
        .user-dropdown-item.logout:hover .item-icon {
          background: rgba(255,56,96,0.15);
          color: #FF3860;
        }

        /* ===== AUTH BUTTONS ===== */
        .btn-login {
          padding: 7px 18px;
          border-radius: 50px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.85);
          font-size: 0.85rem; font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-block;
        }
        .btn-login:hover {
          background: rgba(255,255,255,0.12);
          color: white;
          transform: translateY(-1px);
        }
        .btn-register {
          padding: 7px 18px;
          border-radius: 50px;
          background: linear-gradient(135deg, #1B4FFF, #00C896);
          border: none;
          color: white;
          font-size: 0.85rem; font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 4px 15px rgba(27,79,255,0.35);
        }
        .btn-register:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(27,79,255,0.5);
          color: white;
        }

        /* ===== HAMBURGER ===== */
        .mobile-toggle {
          display: none;
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-toggle:hover { background: rgba(255,255,255,0.12); }
        .hamburger {
          display: flex; flex-direction: column;
          gap: 4px; width: 20px;
        }
        .hamburger span {
          display: block; height: 2px;
          background: rgba(255,255,255,0.8);
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0; transform: scaleX(0);
        }
        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -4px);
        }

        /* ===== SEARCH OVERLAY ===== */
        .search-overlay {
          position: fixed; inset: 0;
          background: rgba(7,11,20,0.85);
          backdrop-filter: blur(12px);
          z-index: 1001;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding-top: 130px;
          animation: fadeIn 0.2s ease;
        }
        .search-overlay-content {
          width: 100%; max-width: 640px; padding: 0 20px;
        }
        .search-hint {
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem; text-align: center;
          margin-bottom: 12px; letter-spacing: 0.5px;
        }
        .search-form {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.05);
          border-radius: 16px; padding: 6px 6px 6px 20px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
          border: 2px solid #1B4FFF;
          transition: all 0.25s ease;
        }
        .search-form:focus-within {
          border-color: #00C896;
          box-shadow: 0 0 0 4px rgba(0,200,150,0.1);
        }
        .search-form-icon {
          font-size: 1.2rem; color: #1B4FFF; flex-shrink: 0;
        }
        .search-form-input {
          flex: 1; padding: 12px 14px;
          font-size: 1.05rem;
          background: transparent; color: white;
          border: none; font-family: inherit;
        }
        .search-form-input::placeholder { color: rgba(255,255,255,0.3); }
        .search-clear {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; cursor: pointer;
          transition: all 0.2s ease; flex-shrink: 0;
          border: none;
        }
        .search-clear:hover { background: rgba(255,56,96,0.2); color: #FF3860; }
        .search-submit {
          padding: 10px 20px;
          background: linear-gradient(135deg, #1B4FFF, #00C896);
          color: white; font-weight: 700; font-size: 0.88rem;
          border-radius: 10px; border: none; cursor: pointer;
          margin-left: 6px; flex-shrink: 0;
          transition: all 0.25s ease;
        }
        .search-submit:hover { transform: scale(1.04); }
        .search-close-btn {
          margin-top: 16px;
          display: flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.35);
          font-size: 0.8rem; cursor: pointer;
          background: none; border: none;
          transition: color 0.2s ease;
          margin-left: auto; margin-right: auto;
        }
        .search-close-btn:hover { color: rgba(255,255,255,0.6); }

        /* ===== MOBILE SIDEBAR ===== */
        .mobile-sidebar-overlay {
          position: fixed; inset: 0;
          background: rgba(7,11,20,0.6);
          z-index: 998; opacity: 0; visibility: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }
        .mobile-sidebar-overlay.active { opacity: 1; visibility: visible; }
        .mobile-sidebar {
          position: fixed; top: 0; left: -310px;
          width: 290px; height: 100vh;
          background: #0D1424;
          z-index: 999;
          transition: left 0.3s cubic-bezier(0.34,1.56,0.64,1);
          display: flex; flex-direction: column;
          box-shadow: 4px 0 40px rgba(0,0,0,0.4);
          overflow-y: auto;
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .mobile-sidebar.active { left: 0; }
        .mobile-sidebar-header {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: linear-gradient(135deg, rgba(27,79,255,0.1), rgba(0,200,150,0.05));
        }
        .mobile-close {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.07);
          color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; cursor: pointer;
          transition: all 0.25s ease; border: none;
        }
        .mobile-close:hover {
          background: rgba(255,56,96,0.2);
          color: #FF3860; transform: rotate(90deg);
        }
        .mobile-user-info {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
        }
        .mobile-user-name {
          font-weight: 700; font-size: 0.9rem; color: white;
        }
        .mobile-user-email {
          font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-top: 2px;
        }
        .mobile-sidebar-links {
          flex: 1; padding: 12px 10px;
        }
        .mobile-link {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 10px;
          color: rgba(255,255,255,0.65);
          font-weight: 600; font-size: 0.92rem;
          transition: all 0.25s ease;
          animation: slideInLeft 0.4s ease both;
          text-decoration: none; position: relative;
          margin-bottom: 2px;
        }
        .mobile-link:hover {
          background: rgba(255,255,255,0.05);
          color: white; padding-left: 20px;
        }
        .mobile-link.active {
          background: rgba(27,79,255,0.12);
          color: white;
          border-left: 3px solid var(--link-color, #1B4FFF);
        }
        .mobile-link-icon {
          font-size: 1.25rem;
          transition: transform 0.25s ease;
        }
        .mobile-link:hover .mobile-link-icon { transform: scale(1.2); }
        .mobile-active-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--link-color, #1B4FFF);
          margin-left: auto;
          animation: pulse 2s infinite;
        }
        .mobile-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 8px 0;
        }
        .mobile-sidebar-footer {
          padding: 16px 18px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .mobile-lang {
          display: flex; gap: 5px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .mobile-lang-btn {
          padding: 5px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          font-size: 0.76rem; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .mobile-lang-btn.active {
          background: rgba(27,79,255,0.15);
          color: #6B9FFF;
          border-color: rgba(27,79,255,0.3);
        }
        .mobile-auth { display: flex; flex-direction: column; gap: 8px; }
        .mobile-logout-btn {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 11px 16px;
          border-radius: 10px;
          background: rgba(255,56,96,0.08);
          border: 1px solid rgba(255,56,96,0.15);
          color: #FF3860;
          font-size: 0.88rem; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          justify-content: center;
        }
        .mobile-logout-btn:hover {
          background: rgba(255,56,96,0.15);
          transform: scale(1.02);
        }

        /* ===== AVATAR ===== */
        .avatar {
          width: 36px; height: 36px;
          border-radius: 50%; overflow: hidden;
          border: 2px solid rgba(27,79,255,0.4);
          flex-shrink: 0;
          transition: all 0.25s ease;
        }
        .avatar-sm { width: 28px; height: 28px; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #1B4FFF, #00C896);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 0.85rem;
        }
        .avatar-sm .avatar-placeholder { font-size: 0.65rem; }

        /* ===== ANIMATIONS ===== */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .navbar-links { display: none; }
          .mobile-toggle { display: flex; }
          .auth-buttons { display: none; }
          .user-name-desktop { display: none; }
        }
        @media (max-width: 768px) {
          .navbar-top-left { display: none; }
          .top-wa-btn span { display: none; }
          .logo-icon { width: 36px; height: 36px; font-size: 1.2rem; }
          .logo-bluex { font-size: 1.2rem; }
        }
        @media (max-width: 480px) {
          .navbar-top { padding: 3px 0; }
          .logo-text { display: none; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
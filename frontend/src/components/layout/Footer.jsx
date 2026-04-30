import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaInstagram, FaEnvelope, FaHeart, FaCode } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoSend, IoNewspaper, IoFilm, IoBriefcase, IoBookmarks } from 'react-icons/io5';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await api.post('/subscribers/subscribe', { email, subscribedTo: 'all' });
      toast.success(t('home.subscribeSuccess'));
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,35 C360,95 1080,5 1440,65 L1440,100 L0,100 Z" fill="url(#fGrad)" />
          <defs>
            <linearGradient id="fGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#070C16" />
              <stop offset="50%" stopColor="#0D1424" />
              <stop offset="100%" stopColor="#0A1918" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section animate-fadeInUp">
              <Link to="/" className="footer-logo">
                <div className="f-logo-icon"><span>B</span></div>
                <div className="f-logo-text">
                  <span className="f-logo-the">THE</span>
                  <span className="f-logo-bluex">BLUEX</span>
                </div>
              </Link>
              <p className="footer-about">{t('footer.aboutText')}</p>
              <div className="social-circles" style={{ marginTop: '14px' }}>
                <a href="https://wa.me/+250780457288?text=THE%20BLUEX" target="_blank" rel="noopener noreferrer"
                  className="social-circle social-whatsapp"><FaWhatsapp /></a>
                <a href="https://www.instagram.com/ni_cyuzuzo_" target="_blank" rel="noopener noreferrer"
                  className="social-circle social-instagram"><FaInstagram /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="social-circle social-x"><FaXTwitter /></a>
                <a href="mailto:thebluex08@gmail.com"
                  className="social-circle social-telegram"><FaEnvelope /></a>
              </div>
            </div>

            <div className="footer-section animate-fadeInUp stagger-2">
              <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
              <ul className="footer-links">
                <li><Link to="/news"><IoNewspaper /> {t('nav.news')}</Link></li>
                <li><Link to="/movies"><IoFilm /> {t('nav.movies')}</Link></li>
                <li><Link to="/jobs"><IoBriefcase /> {t('nav.jobs')}</Link></li>
                <li><Link to="/stories"><IoBookmarks /> {t('nav.stories')}</Link></li>
              </ul>
            </div>

            <div className="footer-section animate-fadeInUp stagger-3">
              <h4 className="footer-heading">{t('home.categories')}</h4>
              <ul className="footer-links">
                <li><Link to="/news?category=announcements">{t('nav.announcements')}</Link></li>
                <li><Link to="/news?category=technology">Technology</Link></li>
                <li><Link to="/news?category=sports">Sports</Link></li>
                <li><Link to="/news?category=entertainment">Entertainment</Link></li>
                <li><Link to="/news?category=business">Business</Link></li>
              </ul>
            </div>

            <div className="footer-section animate-fadeInUp stagger-4">
              <h4 className="footer-heading">{t('footer.newsletter')}</h4>
              <p className="footer-newsletter-text">{t('home.subscribe')}</p>
              <form onSubmit={handleSubscribe} className="footer-subscribe-form">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('home.subscribePlaceholder')} className="footer-subscribe-input" required />
                <button type="submit" className="footer-subscribe-btn" disabled={subscribing}>
                  <IoSend />
                </button>
              </form>
              <div className="footer-contact">
                <p><FaEnvelope /> thebluex08@gmail.com</p>
                <p>🇷🇼 Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} <span className="gradient-text">THE BLUEX</span>. {t('footer.rights')}.
          </p>
          <div className="footer-developer">
            <FaCode className="dev-icon" />
            <span>{t('footer.developer')}{' '}
              <a href="mailto:nicjbdede@gmail.com" className="dev-link">Dev ©</a>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .footer { position: relative; margin-top: 56px; }

        .footer-wave { position: relative; margin-bottom: -2px; }
        .footer-wave svg { display: block; width: 100%; height: 70px; }

        .footer-main {
          background: var(--grad-footer);
          padding: 46px 0 28px;
          color: rgba(255,255,255,0.75);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.8fr 0.8fr 1.2fr;
          gap: 36px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 14px;
        }
        .f-logo-icon {
          width: 42px; height: 42px;
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
        }
        .f-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }
        .f-logo-the {
          font-family: var(--font-display);
          font-size: 0.55rem;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        .f-logo-bluex {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 800;
          background: var(--grad-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .footer-about {
          font-size: 0.85rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.52);
        }

        .footer-heading {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 18px;
          position: relative;
          padding-bottom: 9px;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 30px; height: 2px;
          background: var(--grad-brand);
          border-radius: var(--r-full);
        }

        .footer-links li { margin-bottom: 8px; }
        .footer-links a {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,0.52);
          font-size: 0.85rem;
          transition: all var(--dur-fast) var(--ease-out);
        }
        .footer-links a:hover {
          color: var(--jade-light);
          transform: translateX(4px);
        }

        .footer-newsletter-text {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.52);
          margin-bottom: 12px;
        }

        .footer-subscribe-form {
          display: flex;
          border-radius: var(--r-full);
          overflow: hidden;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 14px;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .footer-subscribe-form:focus-within {
          border-color: var(--cobalt);
          box-shadow: 0 0 12px rgba(27,79,255,0.18);
        }
        .footer-subscribe-input {
          flex: 1;
          padding: 9px 14px;
          background: transparent;
          color: var(--white);
          font-size: 0.85rem;
          font-family: var(--font-body);
          border: none;
        }
        .footer-subscribe-input::placeholder { color: rgba(255,255,255,0.35); }
        .footer-subscribe-btn {
          width: 40px; height: 40px;
          background: var(--grad-brand);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          flex-shrink: 0;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .footer-subscribe-btn:hover { transform: scale(1.04); }
        .footer-subscribe-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .footer-contact p {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.42);
        }

        .footer-bottom {
          background: rgba(0,0,0,0.28);
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .footer-bottom-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .footer-copyright {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.42);
        }

        .footer-developer {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          color: rgba(255,255,255,0.25);
          padding: 3px 10px;
          border-radius: var(--r-full);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.04);
        }
        .dev-icon { color: var(--cobalt-light); font-size: 0.75rem; }
        .dev-link {
          color: var(--jade-light);
          font-weight: 600;
          transition: color var(--dur-fast);
        }
        .dev-link:hover { color: var(--cobalt-light); }
        .dev-heart {
          color: var(--crimson);
          font-size: 0.65rem;
          animation: pulse 1.8s infinite;
        }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 24px; }
          .footer-main { padding: 36px 0 20px; }
          .footer-bottom-inner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaInstagram, FaEnvelope, FaCode, FaPhone } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoSend, IoNewspaper, IoFilm, IoBriefcase, IoBookmarks } from 'react-icons/io5';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await api.post('/subscribers/subscribe', { email, subscribedTo: 'all' });
      toast.success(t('home.subscribeSuccess'));
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setSubscribing(false);
    }
  };

  const contacts = [
    { role: 'Manager', phone: '0782 838 195', whatsapp: '+250782838195' },
    { role: 'Editor', phone: '0793 240 715', whatsapp: '+250793240715' },
    { role: 'Marketing', phone: '0782 838 195', whatsapp: '+250782838195' },
    { role: 'Developer', phone: '0780 457 288', whatsapp: '+250780457288' },
  ];

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,35 C360,95 1080,5 1440,65 L1440,100 L0,100 Z" fill="url(#fGrad)" />
          <defs>
            <linearGradient id="fGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#070C16" />
              <stop offset="50%" stopColor="#0D1424" />
              <stop offset="100%" stopColor="#0A1918" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">

            {/* ✅ Brand Section */}
            <div className="footer-section animate-fadeInUp">
              <Link to="/" className="footer-logo">
                <div className="f-logo-icon"><span>B</span></div>
                <div className="f-logo-text">
                  <span className="f-logo-the">THE</span>
                  <span className="f-logo-bluex">BLUEX</span>
                </div>
              </Link>
              <p className="footer-about">{t('footer.aboutText')}</p>
              <div className="social-circles" style={{ marginTop: '14px' }}>
                <a href="https://wa.me/+250780457288?text=THE%20BLUEX" target="_blank" rel="noopener noreferrer"
                  className="social-circle social-whatsapp"><FaWhatsapp /></a>
                <a href="https://www.instagram.com/ni_cyuzuzo_" target="_blank" rel="noopener noreferrer"
                  className="social-circle social-instagram"><FaInstagram /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="social-circle social-x"><FaXTwitter /></a>
                <a href="mailto:thebluex08@gmail.com"
                  className="social-circle social-telegram"><FaEnvelope /></a>
              </div>
            </div>

            {/* ✅ Quick Links */}
            <div className="footer-section animate-fadeInUp stagger-2">
              <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
              <ul className="footer-links">
                <li><Link to="/news"><IoNewspaper /> {t('nav.news')}</Link></li>
                <li><Link to="/movies"><IoFilm /> {t('nav.movies')}</Link></li>
                <li><Link to="/jobs"><IoBriefcase /> {t('nav.jobs')}</Link></li>
                <li><Link to="/stories"><IoBookmarks /> {t('nav.stories')}</Link></li>
              </ul>

              <h4 className="footer-heading" style={{ marginTop: '22px' }}>{t('home.categories')}</h4>
              <ul className="footer-links">
                <li><Link to="/news?category=announcements">{t('nav.announcements')}</Link></li>
                <li><Link to="/news?category=technology">Technology</Link></li>
                <li><Link to="/news?category=sports">Sports</Link></li>
                <li><Link to="/news?category=entertainment">Entertainment</Link></li>
                <li><Link to="/news?category=business">Business</Link></li>
              </ul>
            </div>

            {/* ✅ Contact Team Section */}
            <div className="footer-section animate-fadeInUp stagger-3">
              <h4 className="footer-heading">Contact Team</h4>
              <div className="contact-team">
                {contacts.map((c) => (
                  <div className="contact-card" key={c.role}>
                    <span className="contact-role">{c.role}</span>
                    <div className="contact-actions">
                      <a href={`tel:${c.phone.replace(/\s/g, '')}`}
                        className="contact-btn contact-phone"
                        title={`Call ${c.role}`}>
                        <FaPhone /> {c.phone}
                      </a>
                      <a href={`https://wa.me/${c.whatsapp}?text=Hello THE BLUEX ${c.role}`}
                        target="_blank" rel="noopener noreferrer"
                        className="contact-btn contact-wa"
                        title={`WhatsApp ${c.role}`}>
                        <FaWhatsapp />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Email */}
              <div className="footer-contact" style={{ marginTop: '16px' }}>
                <p>
                  <FaEnvelope />
                  <a href="mailto:thebluex08@gmail.com" className="footer-email-link">
                    thebluex08@gmail.com
                  </a>
                </p>
                <p>🇷🇼 Kigali, Rwanda</p>
              </div>
            </div>

            {/* ✅ Newsletter */}
            <div className="footer-section animate-fadeInUp stagger-4">
              <h4 className="footer-heading">{t('footer.newsletter')}</h4>
              <p className="footer-newsletter-text">{t('home.subscribe')}</p>
              <form onSubmit={handleSubscribe} className="footer-subscribe-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('home.subscribePlaceholder')}
                  className="footer-subscribe-input"
                  required
                />
                <button type="submit" className="footer-subscribe-btn" disabled={subscribing}>
                  <IoSend />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* ✅ Footer Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} <span className="gradient-text">THE BLUEX</span>. {t('footer.rights')}.
          </p>
          <div className="footer-developer">
            <FaCode className="dev-icon" />
            <span>{t('footer.developer')}{' '}
              <a href="mailto:nicjbdede@gmail.com" className="dev-link">Dev ©</a>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .footer { position: relative; margin-top: 56px; }
        .footer-wave { position: relative; margin-bottom: -2px; }
        .footer-wave svg { display: block; width: 100%; height: 70px; }

        .footer-main {
          background: var(--grad-footer);
          padding: 46px 0 28px;
          color: rgba(255,255,255,0.75);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.1fr 1fr;
          gap: 36px;
        }

        .footer-logo {
          display: flex; align-items: center;
          gap: 9px; margin-bottom: 14px;
        }
        .f-logo-icon {
          width: 42px; height: 42px;
          border-radius: var(--r-md);
          background: var(--grad-brand);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display);
          font-size: 1.4rem; font-weight: 800;
          color: var(--white);
          box-shadow: var(--shadow-cobalt);
        }
        .f-logo-text { display: flex; flex-direction: column; line-height: 1.05; }
        .f-logo-the {
          font-family: var(--font-display);
          font-size: 0.55rem; font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase; letter-spacing: 3px;
        }
        .f-logo-bluex {
          font-family: var(--font-display);
          font-size: 1.3rem; font-weight: 800;
          background: var(--grad-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .footer-about {
          font-size: 0.85rem; line-height: 1.7;
          color: rgba(255,255,255,0.52);
        }

        .footer-heading {
          font-family: var(--font-display);
          font-size: 0.95rem; font-weight: 700;
          color: var(--white);
          margin-bottom: 18px;
          position: relative; padding-bottom: 9px;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 30px; height: 2px;
          background: var(--grad-brand);
          border-radius: var(--r-full);
        }

        .footer-links li { margin-bottom: 8px; }
        .footer-links a {
          display: flex; align-items: center; gap: 7px;
          color: rgba(255,255,255,0.52);
          font-size: 0.85rem;
          transition: all var(--dur-fast) var(--ease-out);
        }
        .footer-links a:hover {
          color: var(--jade-light);
          transform: translateX(4px);
        }

        /* ✅ Contact Team Cards */
        .contact-team {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .contact-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--r-md);
          transition: all var(--dur-fast) var(--ease-out);
        }
        .contact-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(27,79,255,0.3);
        }
        .contact-role {
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          min-width: 70px;
        }
        .contact-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .contact-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          padding: 4px 8px;
          border-radius: var(--r-full);
          transition: all var(--dur-fast) var(--ease-out);
          white-space: nowrap;
        }
        .contact-phone {
          color: rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .contact-phone:hover {
          color: var(--white);
          background: rgba(255,255,255,0.1);
        }
        .contact-wa {
          color: #25D366;
          background: rgba(37,211,102,0.1);
          border: 1px solid rgba(37,211,102,0.2);
          padding: 4px 10px;
          font-size: 0.9rem;
        }
        .contact-wa:hover {
          background: rgba(37,211,102,0.2);
          transform: scale(1.1);
        }

        .footer-contact {
          display: flex; flex-direction: column; gap: 5px;
        }
        .footer-contact p {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.42);
        }
        .footer-email-link {
          color: rgba(255,255,255,0.42);
          transition: color var(--dur-fast);
        }
        .footer-email-link:hover { color: var(--jade-light); }

        .footer-newsletter-text {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.52);
          margin-bottom: 12px;
        }
        .footer-subscribe-form {
          display: flex;
          border-radius: var(--r-full);
          overflow: hidden;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 14px;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .footer-subscribe-form:focus-within {
          border-color: var(--cobalt);
          box-shadow: 0 0 12px rgba(27,79,255,0.18);
        }
        .footer-subscribe-input {
          flex: 1; padding: 9px 14px;
          background: transparent;
          color: var(--white);
          font-size: 0.85rem;
          font-family: var(--font-body);
          border: none;
        }
        .footer-subscribe-input::placeholder { color: rgba(255,255,255,0.35); }
        .footer-subscribe-btn {
          width: 40px; height: 40px;
          background: var(--grad-brand);
          color: var(--white);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.05rem; flex-shrink: 0;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .footer-subscribe-btn:hover { transform: scale(1.04); }
        .footer-subscribe-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .footer-bottom {
          background: rgba(0,0,0,0.28);
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .footer-bottom-inner {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .footer-copyright {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.42);
        }
        .footer-developer {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.68rem;
          color: rgba(255,255,255,0.25);
          padding: 3px 10px;
          border-radius: var(--r-full);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.04);
        }
        .dev-icon { color: var(--cobalt-light); font-size: 0.75rem; }
        .dev-link {
          color: var(--jade-light); font-weight: 600;
          transition: color var(--dur-fast);
        }
        .dev-link:hover { color: var(--cobalt-light); }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 24px; }
          .footer-main { padding: 36px 0 20px; }
          .footer-bottom-inner { flex-direction: column; text-align: center; }
          .contact-card { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
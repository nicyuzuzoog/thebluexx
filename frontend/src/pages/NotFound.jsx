import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoHome, IoArrowBack } from 'react-icons/io5';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
      <div className="animate-bounceIn">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '7rem', fontWeight: 800, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.05em' }}>
          <span className="gradient-text-animated">404</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.02em' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '380px', margin: '0 auto' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '22px' }}>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <IoArrowBack /> {t('common.goBack')}
          </button>
          <Link to="/" className="btn btn-primary">
            <IoHome /> {t('nav.home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
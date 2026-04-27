import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSend, IoNotifications } from 'react-icons/io5';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const SubscribeSection = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/subscribers/subscribe', { email, subscribedTo: 'all' });
      toast.success(t('home.subscribeSuccess'));
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="subscribe-section">
      <div className="subscribe-bg">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="subscribe-particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      <div className="container subscribe-content">
        <div className="subscribe-icon animate-bounceIn">
          <IoNotifications />
        </div>
        <h2 className="subscribe-title animate-fadeInUp">
          {t('home.subscribe')}
        </h2>
        <p className="subscribe-desc animate-fadeInUp stagger-2">
          Get the latest news, movie updates, and job vacancies delivered to your inbox.
        </p>

        <form onSubmit={handleSubscribe} className="subscribe-form animate-fadeInUp stagger-3">
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('home.subscribePlaceholder')}
            className="subscribe-input" required />
          <button type="submit" className="subscribe-btn" disabled={loading}>
            {loading ? (
              <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
            ) : (
              <><IoSend /><span>{t('home.subscribeBtn')}</span></>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .subscribe-section {
          position: relative;
          background: var(--grad-dark);
          padding: 76px 0;
          overflow: hidden;
          text-align: center;
        }

        .subscribe-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .subscribe-particle {
          position: absolute;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(0, 194, 111, 0.15);
          animation: float 4s ease-in-out infinite;
        }
        .subscribe-particle:nth-child(even) {
          background: rgba(27, 79, 255, 0.15);
        }

        .subscribe-content {
          position: relative;
          z-index: 2;
          max-width: 580px;
          margin: 0 auto;
        }

        .subscribe-icon {
          width: 66px; height: 66px;
          border-radius: 50%;
          background: var(--grad-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.7rem;
          color: var(--white);
          margin: 0 auto 22px;
          box-shadow: var(--shadow-cobalt);
          animation: float 3.5s ease-in-out infinite;
        }

        .subscribe-title {
          font-family: var(--font-display);
          font-size: 1.95rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 10px;
          letter-spacing: -0.03em;
        }

        .subscribe-desc {
          color: rgba(255,255,255,0.52);
          font-size: 0.92rem;
          margin-bottom: 28px;
          line-height: 1.7;
        }

        .subscribe-form {
          display: flex;
          border-radius: var(--r-full);
          overflow: hidden;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255,255,255,0.08);
          transition: all var(--dur-mid) var(--ease-out);
          max-width: 480px;
          margin: 0 auto;
        }
        .subscribe-form:focus-within {
          border-color: var(--cobalt-mid);
          box-shadow: 0 0 18px rgba(27,79,255,0.18);
        }

        .subscribe-input {
          flex: 1;
          padding: 13px 22px;
          background: transparent;
          border: none;
          color: var(--white);
          font-size: 0.92rem;
          font-family: var(--font-body);
        }
        .subscribe-input::placeholder { color: rgba(255,255,255,0.35); }

        .subscribe-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 13px 26px;
          background: var(--grad-cobalt);
          color: var(--white);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.88rem;
          white-space: nowrap;
          transition: all var(--dur-mid) var(--ease-out);
          border: none;
          cursor: pointer;
        }
        .subscribe-btn:hover {
          background: var(--grad-brand);
        }
        .subscribe-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 640px) {
          .subscribe-section { padding: 48px 0; }
          .subscribe-title { font-size: 1.45rem; }
          .subscribe-form {
            flex-direction: column;
            border-radius: var(--r-lg);
          }
          .subscribe-btn {
            justify-content: center;
            border-radius: 0;
            padding: 12px;
          }
        }
      `}</style>
    </section>
  );
};

export default SubscribeSection;
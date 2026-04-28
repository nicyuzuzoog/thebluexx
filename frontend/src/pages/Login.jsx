import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoMail, IoLockClosed, IoEye, IoEyeOff, IoLogIn } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('auth.loginTitle')} — THE BLUEX</title>
      </Helmet>

      <div className="auth-page">
        {/* Background */}
        <div className="auth-bg">
          <div className="auth-bg-orb auth-bg-orb-1"></div>
          <div className="auth-bg-orb auth-bg-orb-2"></div>
          <div className="auth-bg-orb auth-bg-orb-3"></div>
          <div className="auth-bg-grid"></div>
        </div>

        <div className="auth-card animate-scaleIn">
          <div className="auth-accent-line"></div>
          <div className="auth-card-orb auth-card-orb-blue"></div>
          <div className="auth-card-orb auth-card-orb-green"></div>

          {/* Header */}
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon"><span>B</span></div>
              <div className="auth-logo-text">
                <span className="auth-logo-sub">Welcome back to</span>
                <span className="gradient-text-animated auth-logo-main">THE BLUEX</span>
              </div>
            </Link>
            <h2 className="auth-title">{t('auth.loginTitle')}</h2>
            <p className="auth-subtitle">
              Rwanda's #1 News & Entertainment Platform 🇷🇼
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                <IoMail /> {t('common.email')}
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><IoMail /></span>
                <input
                  type="email"
                  name="email"
                  className="form-input auth-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <IoLockClosed /> {t('common.password')}
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><IoLockClosed /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input auth-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"
                  style={{ width: '18px', height: '18px', borderWidth: '2px' }}>
                </div>
              ) : (
                <>
                  <IoLogIn />
                  {t('auth.loginBtn')}
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p className="auth-switch">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="auth-switch-link">
                {t('auth.registerBtn')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          background: var(--bg-base);
          overflow: hidden;
        }

        .auth-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .auth-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.12;
        }
        .auth-bg-orb-1 {
          width: 420px; height: 420px;
          background: var(--cobalt);
          top: -120px; right: -80px;
          animation: float 8s ease-in-out infinite;
        }
        .auth-bg-orb-2 {
          width: 320px; height: 320px;
          background: var(--jade);
          bottom: -80px; left: -80px;
          animation: float 10s ease-in-out infinite reverse;
        }
        .auth-bg-orb-3 {
          width: 200px; height: 200px;
          background: var(--violet);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: float 6s ease-in-out infinite;
          opacity: 0.07;
        }
        .auth-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(27,79,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27,79,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          background: var(--bg-surface);
          border-radius: var(--r-xl);
          border: 1px solid var(--border-sharp);
          box-shadow: var(--shadow-2xl);
          overflow: hidden;
        }

        .auth-accent-line {
          height: 3px;
          background: var(--grad-brand);
          width: 100%;
        }

        .auth-card-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          opacity: 0.07;
        }
        .auth-card-orb-blue {
          width: 220px; height: 220px;
          background: var(--cobalt);
          top: -60px; right: -60px;
        }
        .auth-card-orb-green {
          width: 160px; height: 160px;
          background: var(--jade);
          bottom: -40px; left: -40px;
        }

        .auth-header {
          text-align: center;
          padding: 32px 36px 20px;
          position: relative;
          z-index: 1;
        }

        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
          text-decoration: none;
        }
        .auth-logo-icon {
          width: 44px; height: 44px;
          border-radius: var(--r-md);
          background: var(--grad-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--white);
          box-shadow: var(--shadow-cobalt);
          transition: transform var(--dur-mid) var(--ease-spring);
        }
        .auth-logo:hover .auth-logo-icon {
          transform: rotate(-8deg) scale(1.08);
        }
        .auth-logo-text {
          display: flex;
          flex-direction: column;
          text-align: left;
          line-height: 1.1;
        }
        .auth-logo-sub {
          font-family: var(--font-display);
          font-size: 0.6rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .auth-logo-main {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .auth-title {
          font-family: var(--font-display);
          font-size: 1.55rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .auth-subtitle {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .auth-form {
          padding: 8px 36px 24px;
          position: relative;
          z-index: 1;
        }
        .auth-form .form-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.76rem;
          margin-bottom: 6px;
        }

        .auth-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .auth-input-icon {
          position: absolute;
          left: 13px;
          color: var(--text-muted);
          font-size: 1rem;
          pointer-events: none;
          z-index: 1;
          display: flex;
          transition: color var(--dur-fast) var(--ease-out);
        }
        .auth-input-wrap:focus-within .auth-input-icon {
          color: var(--cobalt);
        }
        .auth-input {
          padding-left: 40px !important;
        }

        .auth-eye-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.05rem;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--r-xs);
          transition: color var(--dur-fast);
          z-index: 1;
        }
        .auth-eye-btn:hover { color: var(--cobalt); }

        .auth-submit-btn {
          width: 100%;
          margin-top: 8px;
          height: 48px;
          font-size: 0.95rem;
          letter-spacing: 0.01em;
          position: relative;
          overflow: hidden;
        }
        .auth-submit-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.6s var(--ease-out);
        }
        .auth-submit-btn:hover::before { left: 100%; }
        .auth-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .auth-footer {
          padding: 0 36px 28px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .auth-footer::before {
          content: '';
          display: block;
          height: 1px;
          background: var(--border-soft);
          margin-bottom: 18px;
        }
        .auth-switch {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .auth-switch-link {
          color: var(--cobalt);
          font-weight: 700;
          font-family: var(--font-display);
          transition: color var(--dur-fast);
          text-decoration: none;
        }
        .auth-switch-link:hover { color: var(--jade); }

        @media (max-width: 520px) {
          .auth-page { padding: 20px 14px; }
          .auth-card { border-radius: var(--r-lg); }
          .auth-header { padding: 24px 22px 16px; }
          .auth-form { padding: 6px 22px 20px; }
          .auth-footer { padding: 0 22px 22px; }
          .auth-title { font-size: 1.3rem; }
        }

        @media (max-width: 380px) {
          .auth-header { padding: 18px 16px 12px; }
          .auth-form { padding: 4px 16px 16px; }
          .auth-footer { padding: 0 16px 18px; }
          .auth-title { font-size: 1.15rem; }
        }
      `}</style>
    </>
  );
};

export default Login;
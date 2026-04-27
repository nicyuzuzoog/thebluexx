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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      <Helmet><title>{t('auth.loginTitle')} — THE BLUEX</title></Helmet>
      <div className="auth-page">
        <div className="auth-card animate-scaleIn">
          <div className="auth-accent"></div>
          <div className="auth-orb auth-orb-blue"></div>
          <div className="auth-orb auth-orb-green"></div>

          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon"><span>B</span></div>
              <span className="gradient-text-animated" style={{
                fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800,
                letterSpacing: '-0.03em'
              }}>THE BLUEX</span>
            </Link>
            <h2 className="auth-title">{t('auth.loginTitle')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label"><IoMail /> {t('common.email')}</label>
              <input type="email" name="email" className="form-input"
                value={formData.email} onChange={handleChange}
                placeholder="email@example.com" required />
            </div>

            <div className="form-group">
              <label className="form-label"><IoLockClosed /> {t('common.password')}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="password"
                  className="form-input" value={formData.password} onChange={handleChange}
                  placeholder="••••••••" required style={{ paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    color: 'var(--text-muted)', fontSize: '1.05rem',
                    cursor: 'pointer', padding: '4px', display: 'flex', border: 'none'
                  }}>
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg"
              style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
              ) : (<><IoLogIn /> {t('auth.loginBtn')}</>)}
            </button>
          </form>

          <p className="auth-switch">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="auth-switch-link">{t('auth.registerBtn')}</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .auth-card {
          width: 100%;
          max-width: 430px;
          background: var(--bg-surface);
          border-radius: var(--r-xl);
          padding: 38px 34px;
          box-shadow: var(--shadow-2xl);
          border: 1px solid var(--border-sharp);
          position: relative;
          overflow: hidden;
        }
        .auth-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--grad-brand);
        }
        .auth-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(55px);
          opacity: 0.07;
          pointer-events: none;
        }
        .auth-orb-blue {
          width: 180px; height: 180px;
          background: var(--cobalt);
          top: -70px; right: -70px;
        }
        .auth-orb-green {
          width: 140px; height: 140px;
          background: var(--jade);
          bottom: -50px; left: -50px;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 30px;
          position: relative; z-index: 1;
        }
        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 14px;
        }
        .auth-logo-icon {
          width: 38px; height: 38px;
          border-radius: var(--r-md);
          background: var(--grad-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 800;
        }
        .auth-title {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .auth-form { position: relative; z-index: 1; }
        .auth-form .form-label {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .auth-switch {
          text-align: center;
          margin-top: 18px;
          font-size: 0.88rem;
          color: var(--text-muted);
          position: relative; z-index: 1;
        }
        .auth-switch-link {
          color: var(--cobalt);
          font-weight: 600;
          font-family: var(--font-display);
        }
        .auth-switch-link:hover { color: var(--jade); }

        @media (max-width: 480px) {
          .auth-card { padding: 28px 18px; }
        }
      `}</style>
    </>
  );
};

export default Login;
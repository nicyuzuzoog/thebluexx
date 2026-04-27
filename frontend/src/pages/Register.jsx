import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoMail, IoLockClosed, IoEye, IoEyeOff, IoPerson, IoGlobe, IoPersonAdd } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    preferredLanguage: i18n.language
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.preferredLanguage);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>{t('auth.registerTitle')} — THE BLUEX</title></Helmet>
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
            <h2 className="auth-title">{t('auth.registerTitle')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label"><IoPerson /> {t('common.name')}</label>
              <input type="text" name="name" className="form-input" value={formData.name}
                onChange={handleChange} placeholder="Full Name" required />
            </div>
            <div className="form-group">
              <label className="form-label"><IoMail /> {t('common.email')}</label>
              <input type="email" name="email" className="form-input" value={formData.email}
                onChange={handleChange} placeholder="email@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label"><IoGlobe /> {t('nav.language')}</label>
              <select name="preferredLanguage" className="form-select"
                value={formData.preferredLanguage} onChange={handleChange}>
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="rw">🇷🇼 Kinyarwanda</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label"><IoLockClosed /> {t('common.password')}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="password"
                  className="form-input" value={formData.password} onChange={handleChange}
                  placeholder="Min. 6 characters" required minLength={6}
                  style={{ paddingRight: '44px' }} />
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
            <div className="form-group">
              <label className="form-label"><IoLockClosed /> {t('common.confirmPassword')}</label>
              <input type="password" name="confirmPassword" className="form-input"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="Confirm password" required />
            </div>

            <button type="submit" className="btn btn-primary btn-lg"
              style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
              ) : (<><IoPersonAdd /> {t('auth.registerBtn')}</>)}
            </button>
          </form>

          <p className="auth-switch">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="auth-switch-link">{t('auth.loginBtn')}</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
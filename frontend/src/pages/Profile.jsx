import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoPerson, IoGlobe, IoCamera, IoSave } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '', bio: user?.bio || '',
    preferredLanguage: user?.preferredLanguage || 'en'
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('bio', formData.bio);
      data.append('preferredLanguage', formData.preferredLanguage);
      if (avatar) data.append('avatar', avatar);
      const res = await api.put('/auth/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>{t('nav.profile')} — THE BLUEX</title></Helmet>
      <div className="container" style={{ maxWidth: '580px', padding: '36px 20px' }}>
        <div className="auth-card animate-fadeInUp" style={{ maxWidth: '100%' }}>
          <div className="auth-accent"></div>
          <h2 style={{ textAlign: 'center', marginBottom: '28px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            {t('nav.profile')}
          </h2>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div className="avatar" style={{ width: '90px', height: '90px', margin: '0 auto' }}>
                {preview ? <img src={preview} alt="Avatar" /> :
                  <div className="avatar-placeholder" style={{ fontSize: '1.8rem' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>}
              </div>
              <label style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'var(--grad-brand)', color: 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '0.85rem', boxShadow: 'var(--shadow-md)'
              }}>
                <IoCamera />
                <input type="file" accept="image/*" onChange={handleAvatarChange}
                  style={{ display: 'none' }} />
              </label>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '7px',
              fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {user?.role} • {user?.email}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><IoPerson /> {t('common.name')}</label>
              <input type="text" name="name" className="form-input"
                value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea name="bio" className="form-textarea" value={formData.bio}
                onChange={handleChange} placeholder="Tell us about yourself..."
                maxLength={500} rows={3} />
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
            <button type="submit" className="btn btn-primary btn-lg"
              style={{ width: '100%' }} disabled={loading}>
              {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                : <><IoSave /> {t('common.save')}</>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
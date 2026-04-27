import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoSave, IoImage, IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const CATEGORIES = [
  'announcements', 'news', 'ideas', 'stories', 'technology',
  'sports', 'entertainment', 'politics', 'business',
  'health', 'education', 'culture', 'other'
];

const LANG_TABS = [
  { code: 'en', label: '🇬🇧 English', required: true },
  { code: 'fr', label: '🇫🇷 Français', required: false },
  { code: 'rw', label: '🇷🇼 Kinyarwanda', required: false },
];

const CreateNews = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titleEn: '', titleFr: '', titleRw: '',
    contentEn: '', contentFr: '', contentRw: '',
    summaryEn: '', summaryFr: '', summaryRw: '',
    category: 'news', tags: '',
    isFeatured: false, isBreaking: false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState('en');

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.contentEn || !formData.summaryEn) {
      return toast.error('Please fill in the English fields');
    }
    if (!image) return toast.error('Please add a featured image');

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(k => data.append(k, formData[k]));
      data.append('featuredImage', image);
      await api.post('/news', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('News created successfully!');
      navigate('/admin/news');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <AdminLayout title={t('admin.createNews')}>
      <Helmet><title>{t('admin.createNews')} — THE BLUEX</title></Helmet>

      <button onClick={() => navigate('/admin/news')} className="btn btn-ghost btn-sm"
        style={{ marginBottom: '14px' }}>
        <IoArrowBack /> Back to News
      </button>

      <form onSubmit={handleSubmit}>
        <div className="cn-grid">
          {/* Main */}
          <div className="cn-main">
            <div className="cn-panel">
              <div className="cn-panel-header">
                <h3 className="cn-panel-title">Content</h3>
              </div>
              <div className="cn-panel-body">
                {/* Lang Tabs */}
                <div className="tabs" style={{ marginBottom: '18px' }}>
                  {LANG_TABS.map((lang) => (
                    <button key={lang.code} type="button"
                      className={`tab-btn ${activeLang === lang.code ? 'active' : ''}`}
                      onClick={() => setActiveLang(lang.code)}>
                      {lang.label} {lang.required && '*'}
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Title ({activeLang.toUpperCase()}) {activeLang === 'en' && '*'}
                  </label>
                  <input type="text" className="form-input"
                    name={`title${cap(activeLang)}`}
                    value={formData[`title${cap(activeLang)}`]}
                    onChange={handleChange}
                    placeholder={`Title in ${activeLang}`}
                    required={activeLang === 'en'} />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Summary ({activeLang.toUpperCase()}) {activeLang === 'en' && '*'}
                  </label>
                  <textarea className="form-textarea"
                    name={`summary${cap(activeLang)}`}
                    value={formData[`summary${cap(activeLang)}`]}
                    onChange={handleChange}
                    placeholder={`Brief summary in ${activeLang}`}
                    rows={2} maxLength={300}
                    required={activeLang === 'en'}
                    style={{ minHeight: '68px' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Content ({activeLang.toUpperCase()}) {activeLang === 'en' && '*'}
                  </label>
                  <textarea className="form-textarea"
                    name={`content${cap(activeLang)}`}
                    value={formData[`content${cap(activeLang)}`]}
                    onChange={handleChange}
                    placeholder={`Full article content in ${activeLang}`}
                    rows={14} required={activeLang === 'en'}
                    style={{ minHeight: '260px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="cn-sidebar">
            {/* Image */}
            <div className="cn-panel" style={{ marginBottom: '14px' }}>
              <div className="cn-panel-header">
                <h3 className="cn-panel-title"><IoImage /> Featured Image *</h3>
              </div>
              <div className="cn-panel-body">
                {preview && (
                  <img src={preview} alt="Preview"
                    style={{ width: '100%', height: '170px', objectFit: 'cover',
                      borderRadius: 'var(--r-md)', marginBottom: '10px' }} />
                )}
                <label className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}>
                  <IoImage /> {preview ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImage}
                    style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Settings */}
            <div className="cn-panel" style={{ marginBottom: '14px' }}>
              <div className="cn-panel-header">
                <h3 className="cn-panel-title">Settings</h3>
              </div>
              <div className="cn-panel-body">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" name="category"
                    value={formData.category} onChange={handleChange} required>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input type="text" className="form-input" name="tags"
                    value={formData.tags} onChange={handleChange}
                    placeholder="e.g. rwanda, tech" />
                </div>
                <div className="cn-toggles">
                  <label className="cn-toggle-label">
                    <input type="checkbox" name="isFeatured"
                      checked={formData.isFeatured} onChange={handleChange}
                      style={{ accentColor: 'var(--cobalt)', width: '16px', height: '16px' }} />
                    Featured News
                  </label>
                  <label className="cn-toggle-label">
                    <input type="checkbox" name="isBreaking"
                      checked={formData.isBreaking} onChange={handleChange}
                      style={{ accentColor: 'var(--crimson)', width: '16px', height: '16px' }} />
                    Breaking News
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-lg"
              style={{ width: '100%' }} disabled={loading}>
              {loading
                ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                : <><IoSave /> Publish News</>}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .cn-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 18px;
        }
        .cn-panel {
          background: var(--bg-surface);
          border: 1px solid var(--border-sharp);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        .cn-panel-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-soft);
          background: var(--grad-card-hover);
        }
        .cn-panel-title {
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: -0.01em;
        }
        .cn-panel-body { padding: 16px; }

        .cn-toggles {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .cn-toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .cn-grid { grid-template-columns: 1fr; }
          .cn-sidebar { order: -1; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default CreateNews;
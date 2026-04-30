import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoAdd, IoTrash, IoClose, IoSave } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/helpers';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminAds = () => {
  const { t } = useTranslation();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    position: 'top-banner'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchAds(); }, []);

  const fetchAds = async () => {
    try {
      const res = await api.get('/ads/all');
      setAds(res.data.data);
    } catch (e) { /* */ } finally { setLoading(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !formData.title) return toast.error('Title and image are required');
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('link', formData.link);
      data.append('position', formData.position);
      data.append('image', image);
      const res = await api.post('/ads', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAds(prev => [res.data.data, ...prev]);
      setFormData({ title: '', link: '', position: 'top-banner' });
      setImage(null);
      setImagePreview('');
      setShowForm(false);
      toast.success('Ad created!');
    } catch (e) { toast.error('Failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ad?')) return;
    try {
      await api.delete(`/ads/${id}`);
      setAds(prev => prev.filter(a => a._id !== id));
      toast.success('Ad deleted');
    } catch (e) { toast.error('Failed'); }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const res = await api.put(`/ads/${id}`, { isActive: !isActive });
      setAds(prev => prev.map(a => a._id === id ? res.data.data : a));
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <AdminLayout title={t('admin.manageAds')}>
      <Helmet><title>{t('admin.manageAds')} — THE BLUEX</title></Helmet>

      <div style={{ marginBottom: '18px' }}>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><IoClose /> Cancel</> : <><IoAdd /> {t('admin.createAd')}</>}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="aa-form-wrap animate-fadeInDown">
          <h3 className="aa-form-title">New Advertisement</h3>
          <form onSubmit={handleSubmit}>
            <div className="aa-form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Title *</label>
                <input type="text" className="form-input" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Link URL</label>
                <input type="url" className="form-input" value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Position</label>
                <select className="form-select" value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}>
                  <option value="top-banner">Top Banner</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="in-feed">In Feed</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Image *</label>
                <input type="file" accept="image/*" onChange={handleImageChange}
                  className="form-input" style={{ padding: '8px' }} />
              </div>
            </div>
            {imagePreview && (
              <img src={imagePreview} alt="Preview"
                style={{
                  width: '100%', maxHeight: '180px', objectFit: 'cover',
                  borderRadius: 'var(--r-md)', marginTop: '14px'
                }} />
            )}
            <button type="submit" className="btn btn-primary btn-sm"
              disabled={submitting} style={{ marginTop: '14px' }}>
              {submitting ? '...' : <><IoSave /> Create Ad</>}
            </button>
          </form>
        </div>
      )}

      {/* Ads Grid */}
      {loading ? (
        <div className="aa-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton" style={{ height: '150px' }}></div>
              <div className="card-body">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text-sm"></div>
              </div>
            </div>
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📢</div>
          <h3 className="empty-state-title">No advertisements yet</h3>
        </div>
      ) : (
        <div className="aa-grid">
          {ads.map((ad) => (
            <div key={ad._id} className="aa-card animate-fadeInUp">
              <div className="aa-card-img">
                {/* ✅ Fixed: use getImageUrl */}
                <img src={getImageUrl(ad.image)} alt={ad.title} />
              </div>
              <div className="aa-card-body">
                <h4 className="aa-card-title">{ad.title}</h4>
                <div className="aa-card-meta">
                  <span className="tag tag-outline" style={{ fontSize: '0.65rem' }}>
                    {ad.position}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    👁 {ad.impressions}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    🖱 {ad.clicks}
                  </span>
                </div>
                <div className="aa-card-actions">
                  <button className="btn btn-sm" style={{
                    flex: 1,
                    background: ad.isActive ? 'rgba(0,194,111,0.08)' : 'rgba(229,52,74,0.08)',
                    color: ad.isActive ? 'var(--jade)' : 'var(--crimson)',
                    border: 'none',
                  }}
                    onClick={() => toggleActive(ad._id, ad.isActive)}>
                    {ad.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button className="at-btn at-btn-red" onClick={() => handleDelete(ad._id)}>
                    <IoTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .aa-form-wrap { background: var(--bg-surface); border: 1px solid var(--border-sharp); border-radius: var(--r-lg); padding: 18px; margin-bottom: 18px; }
        .aa-form-title { font-family: var(--font-display); font-size: 0.92rem; font-weight: 700; margin-bottom: 14px; letter-spacing: -0.01em; }
        .aa-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .aa-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .aa-card { background: var(--bg-surface); border-radius: var(--r-lg); border: 1px solid var(--border-sharp); overflow: hidden; transition: all var(--dur-mid) var(--ease-out); }
        .aa-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .aa-card-img { height: 150px; overflow: hidden; }
        .aa-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--dur-slow) var(--ease-out); }
        .aa-card:hover .aa-card-img img { transform: scale(1.04); }
        .aa-card-body { padding: 13px; }
        .aa-card-title { font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; margin-bottom: 7px; letter-spacing: -0.01em; }
        .aa-card-meta { display: flex; gap: 7px; align-items: center; margin-bottom: 10px; flex-wrap: wrap; }
        .aa-card-actions { display: flex; gap: 6px; align-items: center; }
        .at-btn { width: 28px; height: 28px; border-radius: var(--r-sm); display: inline-flex; align-items: center; justify-content: center; font-size: 0.92rem; cursor: pointer; border: none; transition: all var(--dur-fast) var(--ease-out); }
        .at-btn:hover { transform: scale(1.08); }
        .at-btn-red { background: rgba(229,52,74,0.08); color: var(--crimson); }
        @media (max-width: 640px) { .aa-form-grid { grid-template-columns: 1fr; } .aa-grid { grid-template-columns: 1fr; } }
      `}</style>
    </AdminLayout>
  );
};

export default AdminAds;
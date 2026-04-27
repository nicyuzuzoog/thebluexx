import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoSave, IoImage, IoArrowBack, IoVideocam, IoLink } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { extractYouTubeId } from '../../utils/helpers';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const GENRES = [
  'action', 'comedy', 'drama', 'horror', 'romance', 'thriller',
  'sci-fi', 'documentary', 'animation', 'adventure', 'crime',
  'fantasy', 'musical', 'mystery', 'biography', 'family',
  'rwandan', 'african', 'other'
];

const LANG_TABS = [
  { code: 'en', label: '🇬🇧 English', required: true },
  { code: 'fr', label: '🇫🇷 Français', required: false },
  { code: 'rw', label: '🇷🇼 Kinyarwanda', required: false },
];

const CreateMovie = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titleEn: '', titleFr: '', titleRw: '',
    descriptionEn: '', descriptionFr: '', descriptionRw: '',
    trailerUrl: '', downloadUrl: '',
    genre: '', duration: '', releaseYear: '',
    language: 'English', director: '', cast: '',
    rating: '', quality: '720p', isFeatured: false,
  });
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState('en');

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'trailerUrl' && value && !poster) {
      const ytId = extractYouTubeId(value);
      if (ytId) setPosterPreview(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
    }
  };

  const handlePoster = (e) => {
    const file = e.target.files[0];
    if (file) { setPoster(file); setPosterPreview(URL.createObjectURL(file)); }
  };

  const addGenre = (g) => {
    const cur = formData.genre ? formData.genre.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!cur.includes(g)) {
      setFormData(prev => ({ ...prev, genre: [...cur, g].join(', ') }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.descriptionEn || !formData.trailerUrl) {
      return toast.error('Please fill required fields');
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(k => data.append(k, formData[k]));
      if (poster) data.append('poster', poster);
      await api.post('/movies', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Movie added successfully!');
      navigate('/admin/movies');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <AdminLayout title={t('admin.createMovie')}>
      <Helmet><title>{t('admin.createMovie')} — THE BLUEX</title></Helmet>

      <button onClick={() => navigate('/admin/movies')} className="btn btn-ghost btn-sm"
        style={{ marginBottom: '14px' }}>
        <IoArrowBack /> Back to Movies
      </button>

      <form onSubmit={handleSubmit}>
        <div className="cn-grid">
          {/* Main */}
          <div className="cn-main">
            <div className="cn-panel">
              <div className="cn-panel-header">
                <h3 className="cn-panel-title">Movie Details</h3>
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
                    required={activeLang === 'en'} />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Description ({activeLang.toUpperCase()}) {activeLang === 'en' && '*'}
                  </label>
                  <textarea className="form-textarea"
                    name={`description${cap(activeLang)}`}
                    value={formData[`description${cap(activeLang)}`]}
                    onChange={handleChange}
                    rows={6} required={activeLang === 'en'} />
                </div>

                {/* URLs */}
                <div className="form-group">
                  <label className="form-label">
                    <IoVideocam /> YouTube Trailer URL *
                  </label>
                  <input type="url" className="form-input" name="trailerUrl"
                    value={formData.trailerUrl} onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..." required />
                  {formData.trailerUrl && extractYouTubeId(formData.trailerUrl) && (
                    <p style={{ fontSize: '0.74rem', color: 'var(--jade)', marginTop: '4px',
                      fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                      ✓ Valid YouTube URL
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <IoLink /> Download URL (MediaFire, etc.)
                  </label>
                  <input type="url" className="form-input" name="downloadUrl"
                    value={formData.downloadUrl} onChange={handleChange}
                    placeholder="https://www.mediafire.com/file/..." />
                </div>

                {/* Info Grid */}
                <div className="cm-info-grid">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Director</label>
                    <input type="text" className="form-input" name="director"
                      value={formData.director} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Duration</label>
                    <input type="text" className="form-input" name="duration"
                      value={formData.duration} onChange={handleChange}
                      placeholder="e.g. 2h 15m" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Release Year</label>
                    <input type="number" className="form-input" name="releaseYear"
                      value={formData.releaseYear} onChange={handleChange}
                      placeholder="2024" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Rating (0-10)</label>
                    <input type="number" className="form-input" name="rating"
                      value={formData.rating} onChange={handleChange}
                      min="0" max="10" step="0.1" placeholder="7.5" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Language</label>
                    <input type="text" className="form-input" name="language"
                      value={formData.language} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Quality</label>
                    <select className="form-select" name="quality"
                      value={formData.quality} onChange={handleChange}>
                      <option>360p</option>
                      <option>480p</option>
                      <option>720p</option>
                      <option>1080p</option>
                      <option>4K</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label className="form-label">Cast (comma separated)</label>
                  <input type="text" className="form-input" name="cast"
                    value={formData.cast} onChange={handleChange}
                    placeholder="Actor 1, Actor 2" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="cn-sidebar">
            {/* Poster */}
            <div className="cn-panel" style={{ marginBottom: '14px' }}>
              <div className="cn-panel-header">
                <h3 className="cn-panel-title"><IoImage /> Movie Poster</h3>
              </div>
              <div className="cn-panel-body">
                {posterPreview && (
                  <img src={posterPreview} alt="Poster"
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover',
                      borderRadius: 'var(--r-md)', marginBottom: '10px' }} />
                )}
                <label className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}>
                  <IoImage /> {posterPreview ? 'Change Poster' : 'Upload Poster'}
                  <input type="file" accept="image/*" onChange={handlePoster}
                    style={{ display: 'none' }} />
                </label>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center',
                  marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                  Auto-generated from YouTube if not uploaded
                </p>
              </div>
            </div>

            {/* Genre */}
            <div className="cn-panel" style={{ marginBottom: '14px' }}>
              <div className="cn-panel-header">
                <h3 className="cn-panel-title">Genre & Options</h3>
              </div>
              <div className="cn-panel-body">
                <div className="form-group">
                  <label className="form-label">Genre (comma separated)</label>
                  <input type="text" className="form-input" name="genre"
                    value={formData.genre} onChange={handleChange}
                    placeholder="action, drama" />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {GENRES.slice(0, 12).map(g => (
                    <button key={g} type="button"
                      className="tag tag-outline"
                      style={{ cursor: 'pointer', fontSize: '0.65rem' }}
                      onClick={() => addGenre(g)}>
                      + {g}
                    </button>
                  ))}
                </div>

                <label className="cn-toggle-label" style={{ marginTop: '14px' }}>
                  <input type="checkbox" name="isFeatured"
                    checked={formData.isFeatured} onChange={handleChange}
                    style={{ accentColor: 'var(--cobalt)', width: '16px', height: '16px' }} />
                  Featured Movie
                </label>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-lg"
              style={{ width: '100%' }} disabled={loading}>
              {loading
                ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                : <><IoSave /> Add Movie</>}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .cn-grid { display: grid; grid-template-columns: 1fr 310px; gap: 18px; }
        .cn-panel { background: var(--bg-surface); border: 1px solid var(--border-sharp); border-radius: var(--r-lg); overflow: hidden; }
        .cn-panel-header { padding: 12px 16px; border-bottom: 1px solid var(--border-soft); background: var(--grad-card-hover); }
        .cn-panel-title { font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; display: flex; align-items: center; gap: 6px; letter-spacing: -0.01em; }
        .cn-panel-body { padding: 16px; }
        .cn-toggle-label { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 0.84rem; font-weight: 500; cursor: pointer; }
        .cm-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        @media (max-width: 1024px) {
          .cn-grid { grid-template-columns: 1fr; }
          .cn-sidebar { order: -1; }
          .cm-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default CreateMovie;
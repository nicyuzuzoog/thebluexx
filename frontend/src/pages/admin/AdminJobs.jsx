import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoAdd, IoTrash, IoSave, IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { getLocalizedText, formatDate } from '../../utils/helpers';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminJobs = () => {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titleEn: '', titleFr: '', titleRw: '',
    descriptionEn: '', descriptionFr: '', descriptionRw: '',
    company: '', location: '', salary: 'Negotiable',
    type: 'full-time', requirements: '',
    applicationUrl: '', applicationEmail: '', deadline: ''
  });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs?limit=100');
      setJobs(res.data.data);
    } catch (e) { /* */ } finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/jobs', formData);
      setJobs(prev => [res.data.data, ...prev]);
      setFormData({
        titleEn: '', titleFr: '', titleRw: '',
        descriptionEn: '', descriptionFr: '', descriptionRw: '',
        company: '', location: '', salary: 'Negotiable',
        type: 'full-time', requirements: '',
        applicationUrl: '', applicationEmail: '', deadline: ''
      });
      setShowForm(false);
      toast.success('Job posted!');
    } catch (e) { toast.error('Failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Deleted');
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <AdminLayout title={t('admin.manageJobs')}>
      <Helmet><title>{t('admin.manageJobs')} — THE BLUEX</title></Helmet>

      <div style={{ marginBottom: '16px' }}>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><IoClose /> Cancel</> : <><IoAdd /> {t('admin.createJob')}</>}
        </button>
      </div>

      {showForm && (
        <div className="aj-form-wrap animate-fadeInDown">
          <h3 className="aj-form-title">New Job Vacancy</h3>
          <form onSubmit={handleSubmit}>
            <div className="aj-form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Title (EN) *</label>
                <input className="form-input" name="titleEn"
                  value={formData.titleEn} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Title (FR)</label>
                <input className="form-input" name="titleFr"
                  value={formData.titleFr} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company *</label>
                <input className="form-input" name="company"
                  value={formData.company} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location *</label>
                <input className="form-input" name="location"
                  value={formData.location} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Salary</label>
                <input className="form-input" name="salary"
                  value={formData.salary} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Type</label>
                <select className="form-select" name="type"
                  value={formData.type} onChange={handleChange}>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Deadline</label>
                <input type="date" className="form-input" name="deadline"
                  value={formData.deadline} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Application URL</label>
                <input className="form-input" name="applicationUrl"
                  value={formData.applicationUrl} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">Description (EN) *</label>
              <textarea className="form-textarea" name="descriptionEn"
                value={formData.descriptionEn} onChange={handleChange}
                required rows={4} />
            </div>
            <div className="form-group">
              <label className="form-label">Requirements (comma separated)</label>
              <input className="form-input" name="requirements"
                value={formData.requirements} onChange={handleChange}
                placeholder="Req 1, Req 2, Req 3" />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? '...' : <><IoSave /> Post Job</>}
            </button>
          </form>
        </div>
      )}

      <div className="at-wrapper">
        <table className="at-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Type</th>
              <th>Deadline</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j}><div className="skeleton skeleton-text"></div></td>
                  ))}
                </tr>
              ))
            ) : jobs.length === 0 ? (
              <tr><td colSpan="6" className="at-empty">No jobs posted yet</td></tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id}>
                  <td className="at-cell-title">
                    {getLocalizedText(job.title, i18n.language)}
                  </td>
                  <td className="at-cell-sub">{job.company}</td>
                  <td>
                    <span className="tag tag-blue" style={{ fontSize: '0.65rem' }}>
                      {job.type}
                    </span>
                  </td>
                  <td className="at-cell-muted">
                    {job.deadline ? formatDate(job.deadline) : '—'}
                  </td>
                  <td className="at-cell-sub">{job.views}</td>
                  <td>
                    <button className="at-btn at-btn-red"
                      onClick={() => handleDelete(job._id)}>
                      <IoTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .aj-form-wrap {
          background: var(--bg-surface);
          border: 1px solid var(--border-sharp);
          border-radius: var(--r-lg);
          padding: 18px;
          margin-bottom: 16px;
        }
        .aj-form-title {
          font-family: var(--font-display);
          font-size: 0.92rem;
          font-weight: 700;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        .aj-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 0;
        }
        .at-wrapper { overflow-x: auto; background: var(--bg-surface); border-radius: var(--r-lg); border: 1px solid var(--border-sharp); }
        .at-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        .at-table thead { background: var(--grad-card-hover); border-bottom: 1px solid var(--border-sharp); }
        .at-table th { padding: 10px 14px; text-align: left; font-family: var(--font-display); font-weight: 700; font-size: 0.72rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
        .at-table td { padding: 10px 14px; border-bottom: 1px solid var(--border-soft); vertical-align: middle; }
        .at-table tr:last-child td { border-bottom: none; }
        .at-table tbody tr:hover td { background: var(--bg-overlay); }
        .at-cell-title { font-family: var(--font-display); font-weight: 600; font-size: 0.84rem; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.01em; }
        .at-cell-sub { font-size: 0.82rem; color: var(--text-body); }
        .at-cell-muted { font-size: 0.76rem; color: var(--text-muted); white-space: nowrap; }
        .at-empty { text-align: center; padding: 36px; color: var(--text-muted); font-family: var(--font-display); font-size: 0.88rem; }
        .at-btn { width: 28px; height: 28px; border-radius: var(--r-sm); display: inline-flex; align-items: center; justify-content: center; font-size: 0.92rem; cursor: pointer; border: none; transition: all var(--dur-fast) var(--ease-out); }
        .at-btn:hover { transform: scale(1.08); }
        .at-btn-red { background: rgba(229,52,74,0.08); color: var(--crimson); }

        @media (max-width: 640px) {
          .aj-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminJobs;
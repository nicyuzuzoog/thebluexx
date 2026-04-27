import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  IoBriefcase, IoLocation, IoCash, IoCalendar,
  IoOpenOutline, IoChevronDown, IoChevronUp
} from 'react-icons/io5';
import { getLocalizedText, formatDate } from '../utils/helpers';
import api from '../utils/api';

const JobsPage = () => {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState('');

  const jobTypes = ['', 'full-time', 'part-time', 'contract', 'internship', 'remote'];

  const typeColors = {
    'full-time': { bg: 'rgba(27,79,255,0.08)', color: 'var(--cobalt)' },
    'part-time': { bg: 'rgba(0,194,111,0.08)', color: 'var(--jade)' },
    'contract': { bg: 'rgba(245,158,11,0.08)', color: 'var(--amber)' },
    'internship': { bg: 'rgba(124,58,237,0.08)', color: 'var(--violet)' },
    'remote': { bg: 'rgba(14,165,233,0.08)', color: '#0EA5E9' },
  };

  useEffect(() => { fetchJobs(); }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = '/jobs?limit=50';
      if (filter) url += `&type=${filter}`;
      const res = await api.get(url);
      setJobs(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>{t('jobs.title')} — THE BLUEX</title></Helmet>

      <div className="jp-hero">
        <div className="jp-hero-bg">
          <div className="jp-orb jp-orb-1"></div>
          <div className="jp-orb jp-orb-2"></div>
        </div>
        <div className="container jp-hero-content">
          <h1 className="jp-hero-title animate-fadeInUp">💼 {t('jobs.title')}</h1>
          <p className="jp-hero-desc animate-fadeInUp stagger-2">
            Find your dream job in Rwanda and beyond
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px', maxWidth: '900px' }}>
        {/* Type Filter */}
        <div className="filter-pills" style={{ marginBottom: '22px', justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {jobTypes.map((type) => (
            <button key={type}
              className={`filter-pill ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}>
              {type || t('news.all')}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card" style={{ padding: '22px' }}>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text-sm"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💼</div>
            <h3 className="empty-state-title">{t('jobs.noJobs')}</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {jobs.map((job, index) => {
              const isOpen = selectedJob?._id === job._id;
              return (
                <div key={job._id}
                  className="job-card animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="job-card-header"
                    onClick={() => setSelectedJob(isOpen ? null : job)}>
                    <div className="job-card-left">
                      <h3 className="job-title">
                        {getLocalizedText(job.title, i18n.language)}
                      </h3>
                      <div className="job-meta">
                        <span><IoBriefcase /> {job.company}</span>
                        <span><IoLocation /> {job.location}</span>
                        <span><IoCash /> {job.salary}</span>
                        {job.deadline && (
                          <span><IoCalendar /> {formatDate(job.deadline, i18n.language)}</span>
                        )}
                      </div>
                    </div>
                    <div className="job-card-right">
                      <span className="tag" style={{
                        background: typeColors[job.type]?.bg || 'var(--bg-overlay)',
                        color: typeColors[job.type]?.color || 'var(--text-body)',
                      }}>
                        {job.type}
                      </span>
                      <button className="job-toggle-btn">
                        {isOpen ? <IoChevronUp /> : <IoChevronDown />}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="job-card-body animate-fadeInDown">
                      <p className="job-description">
                        {getLocalizedText(job.description, i18n.language)}
                      </p>
                      {job.requirements?.length > 0 && (
                        <div className="job-requirements">
                          <h4>{t('jobs.requirements')}:</h4>
                          <ul>
                            {job.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="job-apply-row">
                        {job.applicationUrl && (
                          <a href={job.applicationUrl} target="_blank"
                            rel="noopener noreferrer" className="btn btn-primary">
                            <IoOpenOutline /> {t('jobs.apply')}
                          </a>
                        )}
                        {job.applicationEmail && (
                          <a href={`mailto:${job.applicationEmail}`}
                            className="btn btn-secondary">
                            ✉️ Email Application
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .jp-hero {
          position: relative;
          background: var(--grad-dark);
          padding: 56px 0 46px;
          overflow: hidden;
          margin-top: calc(var(--navbar-height) * -1);
          padding-top: calc(var(--navbar-height) + 36px);
        }
        .jp-hero-bg { position: absolute; inset: 0; }
        .jp-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.18;
        }
        .jp-orb-1 {
          width: 280px; height: 280px; background: var(--cobalt);
          top: -90px; right: 8%;
          animation: float 7s ease-in-out infinite;
        }
        .jp-orb-2 {
          width: 200px; height: 200px; background: var(--jade);
          bottom: -50px; left: 18%;
          animation: float 9s ease-in-out infinite reverse;
        }
        .jp-hero-content { position: relative; z-index: 2; text-align: center; }
        .jp-hero-title {
          font-family: var(--font-display); font-size: 2.4rem;
          font-weight: 800; color: var(--white);
          margin-bottom: 10px; letter-spacing: -0.03em;
        }
        .jp-hero-desc { color: rgba(255,255,255,0.52); font-size: 1rem; }

        /* Filter pills */
        .filter-pill {
          padding: 5px 13px; border-radius: var(--r-full);
          background: var(--bg-overlay); color: var(--text-body);
          font-family: var(--font-display); font-size: 0.78rem;
          font-weight: 600; cursor: pointer;
          transition: all var(--dur-fast) var(--ease-out);
          border: 1px solid transparent;
        }
        .filter-pill:hover { background: var(--cobalt-xpale); color: var(--cobalt); }
        .filter-pill.active {
          background: var(--grad-cobalt); color: var(--white);
          box-shadow: var(--shadow-cobalt);
        }
        [data-theme="dark"] .filter-pill:hover {
          background: rgba(27,79,255,0.12); color: var(--cobalt-light);
        }

        /* Job Card */
        .job-card {
          background: var(--bg-surface);
          border-radius: var(--r-lg);
          border: 1px solid var(--border-sharp);
          overflow: hidden;
          transition: box-shadow var(--dur-mid) var(--ease-out),
                      border-color var(--dur-mid) var(--ease-out);
        }
        .job-card:hover {
          box-shadow: var(--shadow-md);
          border-color: rgba(27,79,255,0.15);
        }
        .job-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 22px;
          cursor: pointer;
          gap: 14px;
          flex-wrap: wrap;
        }
        .job-card-left { flex: 1; }
        .job-title {
          font-family: var(--font-display);
          font-size: 1.08rem;
          font-weight: 700;
          margin-bottom: 7px;
          letter-spacing: -0.01em;
          transition: color var(--dur-fast);
        }
        .job-card:hover .job-title { color: var(--cobalt); }
        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .job-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .job-card-right {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }
        .job-toggle-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--bg-overlay);
          color: var(--text-muted);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          transition: all var(--dur-fast) var(--ease-out);
        }
        .job-toggle-btn:hover {
          background: var(--cobalt-xpale);
          color: var(--cobalt);
        }

        .job-card-body {
          padding: 0 22px 20px;
          border-top: 1px solid var(--border-soft);
          padding-top: 16px;
        }
        .job-description {
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.8;
          color: var(--text-body);
          margin-bottom: 14px;
        }
        .job-requirements h4 {
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 7px;
          color: var(--text-primary);
        }
        .job-requirements ul {
          padding-left: 18px;
          margin-bottom: 14px;
        }
        .job-requirements ul li {
          font-size: 0.86rem;
          color: var(--text-body);
          margin-bottom: 4px;
          list-style: disc;
        }
        .job-apply-row {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .jp-hero-title { font-size: 1.7rem; }
          .job-card-header { flex-direction: column; }
          .job-card-right { align-self: flex-start; }
        }
      `}</style>
    </>
  );
};

export default JobsPage;
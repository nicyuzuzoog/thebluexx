import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IoMegaphone, IoNewspaper, IoBulb, IoBookmarks,
  IoBriefcase, IoDesktop, IoFootball, IoMusicalNotes,
  IoBusinessOutline, IoMedkit, IoSchool, IoEarth
} from 'react-icons/io5';

const CategoriesSection = () => {
  const { t } = useTranslation();

  const categories = [
    { key: 'announcements', icon: <IoMegaphone />, color: '#1B4FFF', bg: 'rgba(27,79,255,0.08)' },
    { key: 'news', icon: <IoNewspaper />, color: '#00C26F', bg: 'rgba(0,194,111,0.08)' },
    { key: 'ideas', icon: <IoBulb />, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    { key: 'stories', icon: <IoBookmarks />, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
    { key: 'technology', icon: <IoDesktop />, color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
    { key: 'sports', icon: <IoFootball />, color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
    { key: 'entertainment', icon: <IoMusicalNotes />, color: '#EC4899', bg: 'rgba(236,72,153,0.08)' },
    { key: 'business', icon: <IoBusinessOutline />, color: '#0369A1', bg: 'rgba(3,105,161,0.08)' },
    { key: 'health', icon: <IoMedkit />, color: '#14B8A6', bg: 'rgba(20,184,166,0.08)' },
    { key: 'education', icon: <IoSchool />, color: '#6D28D9', bg: 'rgba(109,40,217,0.08)' },
    { key: 'culture', icon: <IoEarth />, color: '#EA580C', bg: 'rgba(234,88,12,0.08)' },
    { key: 'jobs', icon: <IoBriefcase />, color: '#DB2777', bg: 'rgba(219,39,119,0.08)' },
  ];

  const names = {
    announcements: 'Announcements', news: 'News', ideas: 'Ideas', stories: 'Stories',
    technology: 'Technology', sports: 'Sports', entertainment: 'Entertainment',
    business: 'Business', health: 'Health', education: 'Education',
    culture: 'Culture', jobs: 'Jobs',
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-header" style={{ justifyContent: 'center' }}>
          <h2 className="section-title section-title-center">{t('home.categories')}</h2>
        </div>

        <div className="cat-grid">
          {categories.map((cat, i) => (
            <Link
              to={cat.key === 'jobs' ? '/jobs' : `/news?category=${cat.key}`}
              key={cat.key}
              className="cat-card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="cat-icon" style={{ background: cat.bg, color: cat.color }}>
                {cat.icon}
              </div>
              <span className="cat-name">{names[cat.key]}</span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 14px;
        }

        .cat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          padding: 22px 14px;
          border-radius: var(--r-lg);
          background: var(--bg-surface);
          border: 1px solid var(--border-sharp);
          transition: all var(--dur-mid) var(--ease-out);
          text-align: center;
        }
        .cat-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: transparent;
        }

        .cat-icon {
          width: 48px; height: 48px;
          border-radius: var(--r-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          transition: all var(--dur-mid) var(--ease-spring);
        }
        .cat-card:hover .cat-icon {
          transform: scale(1.14) rotate(-5deg);
        }

        .cat-name {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-body);
          transition: color var(--dur-fast);
          letter-spacing: -0.01em;
        }
        .cat-card:hover .cat-name { color: var(--text-primary); }

        @media (max-width: 640px) {
          .cat-grid { grid-template-columns: repeat(3, 1fr); gap: 9px; }
          .cat-card { padding: 14px 8px; }
          .cat-icon { width: 40px; height: 40px; font-size: 1.15rem; }
          .cat-name { font-size: 0.72rem; }
        }

        @media (max-width: 380px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
};

export default CategoriesSection;
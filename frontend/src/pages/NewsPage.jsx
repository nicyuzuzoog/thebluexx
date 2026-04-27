import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoEye, IoHeart, IoTime, IoFilter, IoSearch, IoGrid, IoList } from 'react-icons/io5';
import { getLocalizedText, formatNumber, timeAgo, truncateText } from '../utils/helpers';
import api from '../utils/api';
import AdBanner from '../components/home/AdBanner';

const NewsPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [viewMode, setViewMode] = useState('grid');

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const categories = [
    { value: '', label: t('news.all') }, { value: 'announcements', label: 'Announcements' },
    { value: 'news', label: 'News' }, { value: 'ideas', label: 'Ideas' },
    { value: 'technology', label: 'Technology' }, { value: 'sports', label: 'Sports' },
    { value: 'entertainment', label: 'Entertainment' }, { value: 'politics', label: 'Politics' },
    { value: 'business', label: 'Business' }, { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' }, { value: 'culture', label: 'Culture' },
  ];

  useEffect(() => { fetchNews(); }, [currentCategory, currentSearch, currentSort, currentPage]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = `/news?page=${currentPage}&limit=12`;
      if (currentCategory) url += `&category=${currentCategory}`;
      if (currentSearch) url += `&search=${currentSearch}`;
      if (currentSort) url += `&sort=${currentSort}`;
      const res = await api.get(url);
      setNews(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) { /* */ } finally { setLoading(false); }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const [searchInput, setSearchInput] = useState(currentSearch);

  return (
    <>
      <Helmet><title>{t('news.title')} — THE BLUEX</title></Helmet>

      <div className="page-hero">
        <div className="page-hero-bg">
          <div className="ph-orb ph-orb-1"></div>
          <div className="ph-orb ph-orb-2"></div>
        </div>
        <div className="container page-hero-content">
          <h1 className="page-hero-title animate-fadeInUp">📰 {t('news.allNews')}</h1>
          <p className="page-hero-desc animate-fadeInUp stagger-2">
            Stay informed with the latest news from Rwanda and beyond
          </p>
          <form onSubmit={(e) => { e.preventDefault(); updateFilter('search', searchInput); }}
            className="page-search animate-fadeInUp stagger-3">
            <IoSearch className="page-search-icon" />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('nav.search')} className="page-search-input" />
            <button type="submit" className="btn btn-primary btn-sm">{t('nav.search')}</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        <div className="filters-bar animate-fadeInDown">
          <div className="filters-left">
            <div className="filter-group">
              <label className="filter-label"><IoFilter /> {t('news.filterBy')}</label>
              <div className="filter-pills">
                {categories.map((cat) => (
                  <button key={cat.value}
                    className={`filter-pill ${currentCategory === cat.value ? 'active' : ''}`}
                    onClick={() => updateFilter('category', cat.value)}>{cat.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="filters-right">
            <select className="form-select" style={{ width: 'auto', padding: '7px 38px 7px 12px', fontSize: '0.82rem' }}
              value={currentSort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="">{t('news.latest')}</option>
              <option value="views">{t('news.popular')}</option>
              <option value="likes">{t('news.likes')}</option>
              <option value="oldest">{t('news.oldest')}</option>
            </select>
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}><IoGrid /></button>
              <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}><IoList /></button>
            </div>
          </div>
        </div>

        {currentSearch && (
          <div className="search-results-info animate-fadeIn">
            <span>{pagination.total} results for "<strong>{currentSearch}</strong>"</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearchInput(''); updateFilter('search', ''); }}>Clear</button>
          </div>
        )}

        <AdBanner position="in-feed" />

        {loading ? (
          <div className={viewMode === 'grid' ? 'news-grid' : 'news-list'}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card"><div className="skeleton skeleton-image"></div>
                <div className="card-body"><div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div><div className="skeleton skeleton-text-sm"></div></div></div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">{t('news.noNews')}</h3>
            <p className="empty-state-text">{t('common.noResults')}</p></div>
        ) : (
          <div className={viewMode === 'grid' ? 'news-grid' : 'news-list'}>
            {news.map((item, i) => (
              <Link to={`/news/${item.slug}`} key={item._id}
                className={`card animate-fadeInUp ${viewMode === 'list' ? 'card-horizontal' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`card-image ${viewMode === 'list' ? 'card-image-horizontal' : ''}`}>
                  <img src={item.featuredImage} alt={getLocalizedText(item.title, i18n.language)} loading="lazy" />
                  <span className="card-badge card-badge-blue">{item.category}</span>
                  <div className="card-image-overlay">
                    <span style={{ color: 'var(--white)', fontWeight: 500 }}>{t('home.readMore')} →</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span><IoTime /> {timeAgo(item.createdAt)}</span>
                    <span><IoEye /> {formatNumber(item.views)}</span>
                    <span><IoHeart /> {formatNumber(item.likesCount)}</span>
                  </div>
                  <h3 className="card-title">{getLocalizedText(item.title, i18n.language)}</h3>
                  <p className="card-excerpt">{truncateText(getLocalizedText(item.summary || item.content, i18n.language), 120)}</p>
                  <div className="card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div className="avatar avatar-sm">
                        <div className="avatar-placeholder" style={{ fontSize: '0.65rem' }}>{item.author?.name?.charAt(0) || 'A'}</div>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.author?.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" disabled={currentPage <= 1}
              onClick={() => updateFilter('page', String(currentPage - 1))}>‹</button>
            {[...Array(pagination.pages)].map((_, i) => {
              const p = i + 1;
              if (p === 1 || p === pagination.pages || (p >= currentPage - 2 && p <= currentPage + 2))
                return <button key={p} className={`pagination-btn ${currentPage === p ? 'active' : ''}`}
                  onClick={() => updateFilter('page', String(p))}>{p}</button>;
              if (p === currentPage - 3 || p === currentPage + 3) return <span key={p} style={{ color: 'var(--text-muted)' }}>…</span>;
              return null;
            })}
            <button className="pagination-btn" disabled={currentPage >= pagination.pages}
              onClick={() => updateFilter('page', String(currentPage + 1))}>›</button>
          </div>
        )}
      </div>

      <style>{`
        .page-hero {
          position: relative;
          background: var(--grad-dark);
          padding: 56px 0 46px;
          overflow: hidden;
          margin-top: calc(var(--navbar-height) * -1);
          padding-top: calc(var(--navbar-height) + 36px);
        }
        .page-hero-bg { position: absolute; inset: 0; }
        .ph-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; }
        .ph-orb-1 { width: 280px; height: 280px; background: var(--cobalt); top: -90px; right: 8%; animation: float 7s ease-in-out infinite; }
        .ph-orb-2 { width: 200px; height: 200px; background: var(--jade); bottom: -50px; left: 18%; animation: float 9s ease-in-out infinite reverse; }
        .page-hero-content { position: relative; z-index: 2; text-align: center; }
        .page-hero-title { font-family: var(--font-display); font-size: 2.4rem; font-weight: 800; color: var(--white); margin-bottom: 10px; letter-spacing: -0.03em; }
        .page-hero-desc { color: rgba(255,255,255,0.52); font-size: 1rem; margin-bottom: 26px; }

        .page-search {
          display: flex; align-items: center; max-width: 530px; margin: 0 auto;
          background: rgba(255,255,255,0.06); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08); border-radius: var(--r-full);
          padding: 4px 4px 4px 16px;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .page-search:focus-within { border-color: var(--cobalt-mid); box-shadow: 0 0 18px rgba(27,79,255,0.18); }
        .page-search-icon { color: rgba(255,255,255,0.45); font-size: 1.05rem; flex-shrink: 0; }
        .page-search-input { flex: 1; padding: 9px 12px; background: transparent; color: var(--white); font-size: 0.92rem; border: none; font-family: var(--font-body); }
        .page-search-input::placeholder { color: rgba(255,255,255,0.35); }

        .filters-bar { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 22px; flex-wrap: wrap; }
        .filters-left { flex: 1; }
        .filter-label { display: flex; align-items: center; gap: 5px; font-family: var(--font-display); font-size: 0.82rem; font-weight: 600; color: var(--text-body); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.04em; }
        .filter-pills { display: flex; flex-wrap: wrap; gap: 5px; }
        .filter-pill {
          padding: 5px 13px; border-radius: var(--r-full);
          background: var(--bg-overlay); color: var(--text-body);
          font-family: var(--font-display); font-size: 0.78rem; font-weight: 600;
          cursor: pointer; transition: all var(--dur-fast) var(--ease-out);
          border: 1px solid transparent;
        }
        .filter-pill:hover { background: var(--cobalt-xpale); color: var(--cobalt); }
        .filter-pill.active { background: var(--grad-cobalt); color: var(--white); border-color: transparent; box-shadow: var(--shadow-cobalt); }
        [data-theme="dark"] .filter-pill:hover { background: rgba(27,79,255,0.12); color: var(--cobalt-light); }

        .filters-right { display: flex; align-items: center; gap: 8px; }
        .view-toggle { display: flex; border-radius: var(--r-md); overflow: hidden; border: 1px solid var(--border-sharp); }
        .view-btn { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; background: var(--bg-surface); color: var(--text-muted); font-size: 0.95rem; cursor: pointer; transition: all var(--dur-fast); border: none; }
        .view-btn.active { background: var(--cobalt); color: var(--white); }

        .search-results-info { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-overlay); border-radius: var(--r-md); margin-bottom: 18px; font-size: 0.88rem; color: var(--text-body); }

        .news-list { display: flex; flex-direction: column; gap: 14px; }
        .card-horizontal { display: grid; grid-template-columns: 270px 1fr; }
        .card-image-horizontal { aspect-ratio: auto; height: 100%; }
        .card-image-horizontal img { height: 100%; }

        @media (max-width: 768px) {
          .page-hero { padding: 46px 0 36px; padding-top: calc(var(--navbar-height) + 20px); }
          .page-hero-title { font-size: 1.7rem; }
          .filters-bar { flex-direction: column; }
          .filter-pills { max-width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 6px; }
          .filter-pill { white-space: nowrap; }
          .card-horizontal { grid-template-columns: 1fr; }
          .card-image-horizontal { aspect-ratio: 16/10; }
          .view-toggle { display: none; }
        }
      `}</style>
    </>
  );
};

export default NewsPage;
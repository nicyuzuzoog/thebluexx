import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { IoPlay, IoStar, IoEye, IoSearch, IoFilter, IoDownload } from 'react-icons/io5';
import { getLocalizedText, formatNumber, extractYouTubeId } from '../utils/helpers';
import api from '../utils/api';
import SmartImage from '../components/common/SmartImage';

const MoviesPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const currentGenre = searchParams.get('genre') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const genres = [
    '', 'action', 'comedy', 'drama', 'horror', 'romance',
    'thriller', 'sci-fi', 'documentary', 'animation',
    'adventure', 'rwandan', 'african'
  ];

  useEffect(() => { fetchMovies(); }, [currentGenre, currentSort, currentPage, searchParams.get('search')]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let url = `/movies?page=${currentPage}&limit=16`;
      if (currentGenre) url += `&genre=${currentGenre}`;
      const search = searchParams.get('search');
      if (search) url += `&search=${search}`;
      if (currentSort) url += `&sort=${currentSort}`;
      const res = await api.get(url);
      setMovies(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) { /* */ } finally { setLoading(false); }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const getPosterData = (movie) => {
    if (movie.poster && !movie.poster.includes('youtube') && !movie.poster.includes('img.youtube')) {
      return { src: movie.poster, fallbacks: [] };
    }
    const ytId = extractYouTubeId(movie.trailerUrl);
    if (ytId) {
      return {
        src: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        fallbacks: [
          `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`,
          `https://img.youtube.com/vi/${ytId}/0.jpg`,
        ]
      };
    }
    return { src: '', fallbacks: [] };
  };

  return (
    <>
      <Helmet><title>{t('movies.title')} — THE BLUEX</title></Helmet>

      {/* Hero */}
      <div className="mp-hero">
        <div className="mp-hero-bg">
          <div className="mp-orb mp-orb-1"></div>
          <div className="mp-orb mp-orb-2"></div>
        </div>
        <div className="container mp-hero-content">
          <h1 className="mp-hero-title animate-fadeInUp">🎬 {t('movies.allMovies')}</h1>
          <p className="mp-hero-desc animate-fadeInUp stagger-2">
            Watch trailers, discover new movies, and download your favorites
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); updateFilter('search', searchInput); }}
            className="page-search animate-fadeInUp stagger-3"
          >
            <IoSearch className="page-search-icon" />
            <input type="text" value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search movies..."
              className="page-search-input" />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 20px' }}>
        {/* Filters */}
        <div className="filters-bar animate-fadeInDown">
          <div className="filters-left">
            <div className="filter-group">
              <label className="filter-label"><IoFilter /> {t('movies.genre')}</label>
              <div className="filter-pills">
                {genres.map((genre) => (
                  <button key={genre}
                    className={`filter-pill ${currentGenre === genre ? 'active' : ''}`}
                    onClick={() => updateFilter('genre', genre)}>
                    {genre || t('news.all')}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="filters-right">
            <select className="form-select"
              style={{ width: 'auto', padding: '7px 38px 7px 12px', fontSize: '0.82rem' }}
              value={currentSort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="">{t('news.latest')}</option>
              <option value="views">{t('news.popular')}</option>
              <option value="likes">Most Liked</option>
              <option value="rating">{t('movies.rating')}</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="movie-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="movie-card">
                <div className="skeleton" style={{ aspectRatio: '2/3' }}></div>
                <div style={{ padding: '12px' }}>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text-sm"></div>
                </div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎬</div>
            <h3 className="empty-state-title">{t('movies.noMovies')}</h3>
            <p className="empty-state-text">{t('common.noResults')}</p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie, index) => {
              const poster = getPosterData(movie);
              return (
                <Link to={`/movies/${movie.slug}`} key={movie._id}
                  className="movie-card animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.04}s` }}>
                  <div className="movie-poster">
                    <SmartImage
                      src={poster.src}
                      fallbackSrcs={poster.fallbacks}
                      alt={getLocalizedText(movie.title, i18n.language)}
                    />
                    <div className="movie-play-btn"><IoPlay /></div>
                    {movie.rating > 0 && (
                      <div className="movie-rating-badge">
                        <IoStar /> {movie.rating.toFixed(1)}
                      </div>
                    )}
                    {movie.quality && (
                      <div style={{ position: 'absolute', bottom: '9px', left: '9px', zIndex: 2 }}>
                        <span className="movie-quality">{movie.quality}</span>
                      </div>
                    )}
                    {movie.downloadUrl && (
                      <div style={{ position: 'absolute', bottom: '9px', right: '9px', zIndex: 2 }}>
                        <span className="movie-quality" style={{
                          background: 'var(--jade)',
                          display: 'flex', alignItems: 'center', gap: '2px'
                        }}>
                          <IoDownload /> DL
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">
                      {getLocalizedText(movie.title, i18n.language)}
                    </h3>
                    <div className="movie-meta">
                      {movie.releaseYear && <span>{movie.releaseYear}</span>}
                      {movie.genre?.[0] && <span>• {movie.genre[0]}</span>}
                      <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <IoEye /> {formatNumber(movie.views)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" disabled={currentPage <= 1}
              onClick={() => updateFilter('page', String(currentPage - 1))}>‹</button>
            {[...Array(pagination.pages)].map((_, i) => {
              const p = i + 1;
              if (p === 1 || p === pagination.pages || (p >= currentPage - 2 && p <= currentPage + 2))
                return (
                  <button key={p}
                    className={`pagination-btn ${currentPage === p ? 'active' : ''}`}
                    onClick={() => updateFilter('page', String(p))}>
                    {p}
                  </button>
                );
              if (p === currentPage - 3 || p === currentPage + 3)
                return <span key={p} style={{ color: 'var(--text-muted)' }}>…</span>;
              return null;
            })}
            <button className="pagination-btn" disabled={currentPage >= pagination.pages}
              onClick={() => updateFilter('page', String(currentPage + 1))}>›</button>
          </div>
        )}
      </div>

      <style>{`
        .mp-hero {
          position: relative;
          background: var(--grad-dark);
          padding: 56px 0 46px;
          overflow: hidden;
          margin-top: calc(var(--navbar-height) * -1);
          padding-top: calc(var(--navbar-height) + 36px);
        }
        .mp-hero-bg { position: absolute; inset: 0; }
        .mp-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.18;
        }
        .mp-orb-1 {
          width: 280px; height: 280px; background: var(--cobalt);
          top: -90px; right: 8%;
          animation: float 7s ease-in-out infinite;
        }
        .mp-orb-2 {
          width: 200px; height: 200px; background: var(--jade);
          bottom: -50px; left: 18%;
          animation: float 9s ease-in-out infinite reverse;
        }
        .mp-hero-content {
          position: relative; z-index: 2; text-align: center;
        }
        .mp-hero-title {
          font-family: var(--font-display);
          font-size: 2.4rem; font-weight: 800;
          color: var(--white); margin-bottom: 10px;
          letter-spacing: -0.03em;
        }
        .mp-hero-desc {
          color: rgba(255,255,255,0.52);
          font-size: 1rem; margin-bottom: 26px;
        }

        /* Reuse .page-search, .filter-* from NewsPage */
        .filters-bar {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          gap: 14px; margin-bottom: 22px; flex-wrap: wrap;
        }
        .filters-left { flex: 1; }
        .filter-label {
          display: flex; align-items: center; gap: 5px;
          font-family: var(--font-display); font-size: 0.82rem;
          font-weight: 600; color: var(--text-body);
          margin-bottom: 8px;
          text-transform: uppercase; letter-spacing: 0.04em;
        }
        .filter-pills { display: flex; flex-wrap: wrap; gap: 5px; }
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
          background: var(--grad-cobalt);
          color: var(--white);
          box-shadow: var(--shadow-cobalt);
        }
        [data-theme="dark"] .filter-pill:hover {
          background: rgba(27,79,255,0.12); color: var(--cobalt-light);
        }
        .filters-right { display: flex; align-items: center; gap: 8px; }

        .page-search {
          display: flex; align-items: center;
          max-width: 530px; margin: 0 auto;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--r-full);
          padding: 4px 4px 4px 16px;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .page-search:focus-within {
          border-color: var(--cobalt-mid);
          box-shadow: 0 0 18px rgba(27,79,255,0.18);
        }
        .page-search-icon {
          color: rgba(255,255,255,0.45);
          font-size: 1.05rem; flex-shrink: 0;
        }
        .page-search-input {
          flex: 1; padding: 9px 12px;
          background: transparent; color: var(--white);
          font-size: 0.92rem; font-family: var(--font-body); border: none;
        }
        .page-search-input::placeholder { color: rgba(255,255,255,0.35); }

        @media (max-width: 768px) {
          .mp-hero { padding-top: calc(var(--navbar-height) + 20px); }
          .mp-hero-title { font-size: 1.7rem; }
          .filter-pills { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 6px; }
          .filter-pill { white-space: nowrap; }
          .filters-bar { flex-direction: column; }
        }
      `}</style>
    </>
  );
};

export default MoviesPage;
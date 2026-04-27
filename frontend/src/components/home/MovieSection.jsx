import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoPlay, IoStar, IoEye, IoArrowForward } from 'react-icons/io5';
import { getLocalizedText, formatNumber, extractYouTubeId } from '../../utils/helpers';
import api from '../../utils/api';
import SmartImage from '../common/SmartImage';

const MovieSection = () => {
  const { t, i18n } = useTranslation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/movies?limit=8&sort=views');
        setMovies(res.data.data);
      } catch (e) { /* */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

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

  if (loading) {
    return (
      <section className="section-padding" style={{ background: 'var(--bg-overlay)' }}>
        <div className="container">
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
        </div>
      </section>
    );
  }

  if (movies.length === 0) return null;

  return (
    <section className="section-padding" style={{ background: 'var(--bg-overlay)' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">🎬 {t('home.latestMovies')}</h2>
          <Link to="/movies" className="btn btn-primary btn-sm">
            {t('home.viewAll')} <IoArrowForward />
          </Link>
        </div>

        <div className="movie-grid">
          {movies.map((movie, i) => {
            const poster = getPosterData(movie);
            return (
              <Link to={`/movies/${movie.slug}`} key={movie._id}
                className="movie-card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="movie-poster">
                  <SmartImage src={poster.src} fallbackSrcs={poster.fallbacks}
                    alt={getLocalizedText(movie.title, i18n.language)} />
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
      </div>
    </section>
  );
};

export default MovieSection;
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import ReactPlayer from 'react-player';
import {
  IoPlay, IoStar, IoEye, IoHeart, IoHeartOutline,
  IoDownload, IoArrowBack, IoCalendar, IoTime,
  IoFilm, IoPeople
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import { getLocalizedText, formatNumber, formatDate, extractYouTubeId } from '../utils/helpers';
import api from '../utils/api';
import ShareMenu from '../components/common/ShareMenu';
import CommentSection from '../components/common/CommentSection';
import EmailModal from '../components/common/EmailModal';
import SmartImage from '../components/common/SmartImage';

const MovieDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const [movie, setMovie] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    fetchMovie();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/movies/${slug}`);
      setMovie(res.data.data);
      setLikesCount(res.data.data.likesCount);
      const userEmail = localStorage.getItem('bluex_user_email');
      if (userEmail) setLiked(res.data.data.likes?.some(l => l.email === userEmail));
      if (res.data.data.genre?.[0]) {
        const relRes = await api.get(`/movies?genre=${res.data.data.genre[0]}&limit=5`);
        setRelated(relRes.data.data.filter(m => m._id !== res.data.data._id).slice(0, 4));
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleLike = async () => {
    const email = localStorage.getItem('bluex_user_email');
    if (!email) { setPendingAction('like'); setShowEmailModal(true); return; }
    try {
      const res = await api.post(`/movies/${movie._id}/like`, { email });
      setLiked(res.data.liked); setLikesCount(res.data.likesCount);
    } catch (e) { toast.error('Failed'); }
  };

  const handleDownload = async () => {
    if (!movie.downloadUrl) { toast.info('Download not available yet'); return; }
    try { await api.post(`/movies/${movie._id}/download`); } catch (e) { /* */ }
    window.open(movie.downloadUrl, '_blank');
  };

  const handleShare = async () => {
    try { await api.post(`/movies/${movie._id}/share`); } catch (e) { /* */ }
  };

  const handleEmailSubmit = ({ email }) => {
    localStorage.setItem('bluex_user_email', email);
    setShowEmailModal(false);
    if (pendingAction === 'like') handleLike();
    setPendingAction(null);
  };

  const getPosterData = (m) => {
    if (m.poster && !m.poster.includes('youtube') && !m.poster.includes('img.youtube')) {
      return { src: m.poster, fallbacks: [] };
    }
    const ytId = extractYouTubeId(m.trailerUrl);
    if (ytId) {
      return {
        src: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        fallbacks: [
          `https://img.youtube.com/vi/${ytId}/sddefault.jpg`,
          `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`,
          `https://img.youtube.com/vi/${ytId}/0.jpg`,
        ]
      };
    }
    return { src: '', fallbacks: [] };
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '1100px', padding: '40px 20px' }}>
        <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 'var(--r-lg)', marginBottom: '24px' }}></div>
        <div className="skeleton skeleton-title" style={{ height: '32px' }}></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="empty-state" style={{ minHeight: '50vh' }}>
        <div className="empty-state-icon">🎬</div>
        <h3 className="empty-state-title">Movie not found</h3>
        <Link to="/movies" className="btn btn-primary" style={{ marginTop: '16px' }}>
          <IoArrowBack /> {t('common.goBack')}
        </Link>
      </div>
    );
  }

  const title = getLocalizedText(movie.title, i18n.language);
  const description = getLocalizedText(movie.description, i18n.language);
  const ytId = extractYouTubeId(movie.trailerUrl);
  const posterData = getPosterData(movie);

  return (
    <>
      <Helmet>
        <title>{title} — THE BLUEX Movies</title>
        <meta name="description" content={description?.substring(0, 160)} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={posterData.src} />
      </Helmet>

      <div className="md-page">
        {/* Backdrop */}
        <div className="md-backdrop">
          <SmartImage
            src={movie.backdrop || posterData.src}
            fallbackSrcs={posterData.fallbacks}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px) brightness(0.35)' }}
          />
          <div className="md-backdrop-overlay"></div>
        </div>

        <div className="container md-container">
          <Link to="/movies" className="nd-back-btn" style={{ marginBottom: '18px', display: 'inline-flex', color: 'var(--white)', position: 'relative', zIndex: 3 }}>
            <IoArrowBack /> {t('common.goBack')}
          </Link>

          <div className="md-header">
            {/* Poster */}
            <div className="md-poster animate-fadeInLeft">
              <SmartImage
                src={posterData.src}
                fallbackSrcs={posterData.fallbacks}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {movie.quality && (
                <span className="movie-quality" style={{
                  position: 'absolute', top: '10px', right: '10px',
                  fontSize: '0.75rem', padding: '3px 9px'
                }}>{movie.quality}</span>
              )}
            </div>

            {/* Info */}
            <div className="md-info animate-fadeInRight">
              <h1 className="md-title">{title}</h1>

              <div className="md-meta">
                {movie.releaseYear && (
                  <span className="md-meta-item"><IoCalendar /> {movie.releaseYear}</span>
                )}
                {movie.duration && (
                  <span className="md-meta-item"><IoTime /> {movie.duration}</span>
                )}
                {movie.rating > 0 && (
                  <span className="md-meta-item" style={{ color: 'var(--amber)' }}>
                    <IoStar /> {movie.rating.toFixed(1)}/10
                  </span>
                )}
                <span className="md-meta-item">
                  <IoEye /> {formatNumber(movie.views)} {t('news.views')}
                </span>
              </div>

              {/* Genres */}
              {movie.genre?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
                  {movie.genre.map((g, i) => (
                    <span key={i} className="tag tag-blue">{g}</span>
                  ))}
                </div>
              )}

              {movie.director && (
                <p className="md-detail-row">
                  <strong><IoFilm /> {t('movies.director')}:</strong>
                  <span>{movie.director}</span>
                </p>
              )}
              {movie.cast?.length > 0 && (
                <p className="md-detail-row">
                  <strong><IoPeople /> {t('movies.cast')}:</strong>
                  <span>{movie.cast.join(', ')}</span>
                </p>
              )}
              {movie.language && (
                <p className="md-detail-row">
                  <strong>Language:</strong>
                  <span>{movie.language}</span>
                </p>
              )}

              {/* Actions */}
              <div className="md-actions">
                <button className="btn btn-primary btn-lg" onClick={() => setPlaying(true)}>
                  <IoPlay /> {t('movies.watchTrailer')}
                </button>
                {movie.downloadUrl && (
                  <button className="btn btn-green btn-lg" onClick={handleDownload}>
                    <IoDownload /> {t('movies.download')}
                  </button>
                )}
                <button
                  className={`btn btn-lg ${liked ? 'btn-danger' : ''}`}
                  style={!liked ? {
                    background: 'transparent',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    color: 'var(--white)'
                  } : {}}
                  onClick={handleLike}
                >
                  {liked ? <IoHeart /> : <IoHeartOutline />} {likesCount}
                </button>
                <ShareMenu url={`/movies/${movie.slug}`} title={title} onShare={handleShare} />
              </div>

              {movie.downloads > 0 && (
                <p className="md-downloads">
                  <IoDownload /> {formatNumber(movie.downloads)} {t('movies.downloads')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Player */}
        {playing && ytId && (
  <div className="md-player-wrap">
    <div className="container" style={{ maxWidth: '980px' }}>
      <div className="md-player animate-scaleIn">
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${ytId}`}
          width="100%"
          height="100%"
          controls
          playing
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0
              }
            }
          }}
        />
      </div>
    </div>
  </div>
)}

        {/* Description + Related + Comments */}
        <div className="container" style={{ maxWidth: '980px', padding: '36px 20px 60px' }}>
          <div className="md-desc animate-fadeInUp">
            <h2 className="md-desc-title">Description</h2>
            <p className="md-desc-text">{description}</p>
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '18px' }}>
                {t('movies.relatedMovies')}
              </h2>
              <div className="movie-grid">
                {related.map((m, i) => {
                  const rp = getPosterData(m);
                  return (
                    <Link to={`/movies/${m.slug}`} key={m._id}
                      className="movie-card animate-fadeInUp"
                      style={{ animationDelay: `${i * 0.08}s` }}>
                      <div className="movie-poster">
                        <SmartImage src={rp.src} fallbackSrcs={rp.fallbacks}
                          alt={getLocalizedText(m.title, i18n.language)} />
                        <div className="movie-play-btn"><IoPlay /></div>
                      </div>
                      <div className="movie-info">
                        <h3 className="movie-title">{getLocalizedText(m.title, i18n.language)}</h3>
                        <div className="movie-meta">
                          {m.releaseYear && <span>{m.releaseYear}</span>}
                          <span style={{ marginLeft: 'auto' }}><IoEye /> {formatNumber(m.views)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <CommentSection movieId={movie._id} comments={movie.comments} />
        </div>
      </div>

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        title={t('common.likeRequiresEmail')}
      />

      <style>{`
        .md-page { position: relative; }

        .md-backdrop {
          position: relative;
          height: 520px;
          overflow: hidden;
          margin-top: calc(var(--navbar-height) * -1);
        }
        .md-backdrop-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(7,11,20,0.38) 0%,
            rgba(7,11,20,0.58) 50%,
            var(--bg-base) 100%
          );
        }

        .md-container {
          position: relative;
          margin-top: -268px;
          z-index: 2;
          max-width: 1080px;
          padding-bottom: 0;
        }

        .md-header {
          display: grid;
          grid-template-columns: 230px 1fr;
          gap: 28px;
          align-items: flex-start;
        }

        .md-poster {
          position: relative;
          border-radius: var(--r-lg);
          overflow: hidden;
          box-shadow: 0 18px 56px rgba(0,0,0,0.55);
          aspect-ratio: 2/3;
        }

        .md-title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 12px;
          line-height: 1.18;
          letter-spacing: -0.035em;
        }

        .md-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 14px;
        }
        .md-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: rgba(255,255,255,0.65);
          font-family: var(--font-display);
          font-size: 0.86rem;
          font-weight: 500;
        }

        .md-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          font-size: 0.88rem;
          color: rgba(255,255,255,0.65);
          margin-bottom: 7px;
          font-family: var(--font-body);
        }
        .md-detail-row strong {
          color: var(--white);
          font-family: var(--font-display);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .md-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 18px;
        }

        .md-downloads {
          margin-top: 10px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.42);
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-display);
        }

        .md-player-wrap {
          padding: 28px 0;
          background: var(--bg-overlay);
          margin-top: 28px;
        }
        .md-player {
          position: relative;
          padding-top: 56.25%;
          border-radius: var(--r-lg);
          overflow: hidden;
          box-shadow: var(--shadow-2xl);
        }
        .md-player > div { position: absolute; top: 0; left: 0; }

        .md-desc {
          background: var(--bg-surface);
          border-radius: var(--r-lg);
          padding: 22px;
          border: 1px solid var(--border-sharp);
        }
        .md-desc-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .md-desc-text {
          font-family: var(--font-body);
          line-height: 1.85;
          color: var(--text-body);
          font-size: 0.96rem;
        }

        /* Reuse nd-back-btn from NewsDetail */
        .nd-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: var(--r-full);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: var(--white);
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.12);
          transition: all var(--dur-fast) var(--ease-out);
        }
        .nd-back-btn:hover { background: rgba(255,255,255,0.2); }

        @media (max-width: 768px) {
          .md-backdrop { height: 380px; }
          .md-container { margin-top: -190px; }
          .md-header { grid-template-columns: 148px 1fr; gap: 14px; }
          .md-title { font-size: 1.4rem; }
          .md-actions { flex-direction: column; }
          .md-actions .btn { width: 100%; justify-content: center; }
        }
        @media (max-width: 480px) {
          .md-header { grid-template-columns: 1fr; }
          .md-poster { max-width: 180px; margin: 0 auto; }
          .md-info { text-align: center; }
          .md-meta { justify-content: center; }
          .md-detail-row { justify-content: center; flex-wrap: wrap; }
        }
      `}</style>
    </>
  );
};

export default MovieDetail;
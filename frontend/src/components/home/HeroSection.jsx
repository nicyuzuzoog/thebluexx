import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoNewspaper, IoFilm, IoArrowForward } from 'react-icons/io5';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-particles">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              width: `${3 + Math.random() * 7}px`,
              height: `${3 + Math.random() * 7}px`,
            }} />
          ))}
        </div>
        <div className="hero-orb orb-1"></div>
        <div className="hero-orb orb-2"></div>
        <div className="hero-orb orb-3"></div>
      </div>

      <div className="container hero-content">
        <div className="hero-text">
          <div className="hero-badge animate-fadeInDown">
            <span className="hero-badge-dot"></span>
            🇷🇼 Rwanda's #1 Digital Platform
          </div>

          <h1 className="hero-title animate-fadeInUp">
            {t('home.welcome').split('THE BLUEX')[0]}
            <span className="gradient-text-animated">THE BLUEX</span>
          </h1>

          <p className="hero-description animate-fadeInUp stagger-2">
            {t('home.welcomeDesc')}
          </p>

          <div className="hero-buttons animate-fadeInUp stagger-3">
            <Link to="/news" className="btn btn-primary btn-lg hero-btn">
              <IoNewspaper />
              {t('home.exploreNews')}
              <IoArrowForward className="hero-btn-arrow" />
            </Link>
            <Link to="/movies" className="btn hero-btn hero-btn-outline">
              <IoFilm />
              {t('home.exploreMovies')}
            </Link>
          </div>

          <div className="hero-stats animate-fadeInUp stagger-4">
            <div className="hero-stat">
              <span className="hero-stat-number gradient-text">1K+</span>
              <span className="hero-stat-label">Articles</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number gradient-text">500+</span>
              <span className="hero-stat-label">Movies</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number gradient-text">10K+</span>
              <span className="hero-stat-label">Readers</span>
            </div>
          </div>
        </div>

        <div className="hero-visual animate-fadeInRight">
          <div className="hero-card hero-card-1">
            <div className="hero-card-emoji">📰</div>
            <span>Breaking News</span>
          </div>
          <div className="hero-card hero-card-2">
            <div className="hero-card-emoji">🎬</div>
            <span>New Movies</span>
          </div>
          <div className="hero-card hero-card-3">
            <div className="hero-card-emoji">💼</div>
            <span>Job Alerts</span>
          </div>
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 88vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          margin-top: calc(var(--navbar-height) * -1);
          padding-top: var(--navbar-height);
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: var(--grad-dark);
          z-index: 0;
        }

        .hero-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(0, 194, 111, 0.12);
          animation: float 4s ease-in-out infinite;
        }
        .particle:nth-child(even) {
          background: rgba(27, 79, 255, 0.12);
        }
        .particle:nth-child(3n) {
          background: rgba(100, 144, 255, 0.08);
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.22;
          will-change: transform;
        }
        .orb-1 {
          width: 380px; height: 380px;
          background: var(--cobalt);
          top: -100px; right: -80px;
          animation: float 7s ease-in-out infinite;
        }
        .orb-2 {
          width: 280px; height: 280px;
          background: var(--jade);
          bottom: -60px; left: -60px;
          animation: float 9s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 180px; height: 180px;
          background: var(--cobalt-light);
          top: 45%; left: 48%;
          animation: float 5.5s ease-in-out infinite;
          opacity: 0.14;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 56px;
          align-items: center;
          padding: 56px 0;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 18px;
          border-radius: var(--r-full);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.75);
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 22px;
          letter-spacing: 0.01em;
        }

        .hero-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--jade);
          animation: pulse 1.5s infinite;
          flex-shrink: 0;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: 3.4rem;
          font-weight: 800;
          color: var(--white);
          line-height: 1.12;
          margin-bottom: 18px;
          letter-spacing: -0.035em;
        }

        .hero-description {
          font-size: 1.08rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.8;
          margin-bottom: 30px;
          max-width: 500px;
          font-family: var(--font-body);
        }

        .hero-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 38px;
        }

        .hero-btn {
          position: relative;
          overflow: hidden;
        }

        .hero-btn-outline {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.22);
          color: var(--white);
          padding: 13px 30px;
          border-radius: var(--r-lg);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all var(--dur-mid) var(--ease-out);
        }
        .hero-btn-outline:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.35);
          transform: translateY(-2px);
        }

        .hero-btn-arrow {
          transition: transform var(--dur-fast) var(--ease-out);
        }
        .hero-btn:hover .hero-btn-arrow {
          transform: translateX(3px);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .hero-stat { text-align: center; }

        .hero-stat-number {
          display: block;
          font-size: 1.75rem;
          font-weight: 800;
          font-family: var(--font-display);
          letter-spacing: -0.03em;
        }

        .hero-stat-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.42);
          font-weight: 500;
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-stat-divider {
          width: 1px; height: 36px;
          background: rgba(255,255,255,0.08);
        }

        /* Hero Visual */
        .hero-visual {
          position: relative;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-card {
          position: absolute;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--r-lg);
          padding: 18px 26px;
          display: flex;
          align-items: center;
          gap: 11px;
          color: var(--white);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.92rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          transition: all var(--dur-mid) var(--ease-out);
          letter-spacing: -0.01em;
        }
        .hero-card:hover {
          transform: scale(1.06);
          background: rgba(255,255,255,0.1);
        }

        .hero-card-emoji { font-size: 1.9rem; }

        .hero-card-1 {
          top: 18%; right: 8%;
          animation: float 4.5s ease-in-out infinite;
        }
        .hero-card-2 {
          top: 48%; left: 3%;
          animation: float 5.5s ease-in-out infinite 0.8s;
        }
        .hero-card-3 {
          bottom: 14%; right: 18%;
          animation: float 5s ease-in-out infinite 0.4s;
        }

        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-visual { display: none; }
          .hero-description {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-buttons { justify-content: center; }
          .hero-stats { justify-content: center; }
          .hero-badge { margin-left: auto; margin-right: auto; }
        }

        @media (max-width: 768px) {
          .hero { min-height: 72vh; }
          .hero-title { font-size: 2.3rem; }
          .hero-description { font-size: 0.98rem; }
          .hero-buttons { flex-direction: column; align-items: center; }
          .hero-buttons .btn,
          .hero-buttons .hero-btn-outline { width: 100%; max-width: 320px; justify-content: center; }
          .hero-stats { gap: 16px; }
          .hero-stat-number { font-size: 1.4rem; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 1.85rem; }
          .hero-content { padding: 28px 0; }
          .hero-badge { font-size: 0.74rem; padding: 5px 14px; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
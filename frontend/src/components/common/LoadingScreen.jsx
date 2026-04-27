const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-screen-inner">
        <div className="loading-logo">
          <span className="gradient-text-animated">THE BLUEX</span>
        </div>
        <div className="spinner spinner-large"></div>
        <p className="loading-text">Loading...</p>
      </div>
      <style>{`
        .loading-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          animation: fadeIn 0.3s var(--ease-out);
        }
        .loading-screen-inner {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
        .loading-logo {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
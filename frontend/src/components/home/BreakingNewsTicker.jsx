import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../utils/helpers';
import api from '../../utils/api';

const BreakingNewsTicker = () => {
  const { t, i18n } = useTranslation();
  const [breakingNews, setBreakingNews] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/news/breaking');
        setBreakingNews(res.data.data);
      } catch (e) { /* silent */ }
    };
    fetch();
  }, []);

  if (breakingNews.length === 0) return null;

  return (
    <div className="breaking-ticker">
      <div className="breaking-ticker-label">
        <span className="dot"></span>
        {t('home.breakingNews')}
      </div>
      <div className="breaking-ticker-content">
        {[...breakingNews, ...breakingNews].map((item, i) => (
          <Link key={i} to={`/news/${item.slug}`} className="breaking-ticker-item">
            {getLocalizedText(item.title, i18n.language)}
            <span className="breaking-ticker-separator"> ● </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BreakingNewsTicker;
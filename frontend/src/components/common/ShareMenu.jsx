import { useState, useRef, useEffect } from 'react';
import { FaWhatsapp, FaFacebook, FaTelegram, FaLink, FaShareAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getShareUrl } from '../../utils/helpers';

const ShareMenu = ({ url, title, onShare }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

  const handleShare = (platform) => {
    window.open(getShareUrl(platform, fullUrl, title), '_blank', 'width=600,height=400');
    if (onShare) onShare();
    setIsOpen(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl).then(() => toast.success(t('common.linkCopied')));
    setIsOpen(false);
  };

  return (
    <div className="share-dropdown" ref={menuRef}>
      <button className="btn btn-ghost btn-sm"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <FaShareAlt />
        <span>{t('common.share')}</span>
      </button>

      <div className={`share-menu ${isOpen ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}>
        <button className="share-menu-item" onClick={() => handleShare('whatsapp')}>
          <FaWhatsapp style={{ color: '#25d366' }} /> WhatsApp
        </button>
        <button className="share-menu-item" onClick={() => handleShare('twitter')}>
          <FaXTwitter /> X (Twitter)
        </button>
        <button className="share-menu-item" onClick={() => handleShare('facebook')}>
          <FaFacebook style={{ color: '#4267B2' }} /> Facebook
        </button>
        <button className="share-menu-item" onClick={() => handleShare('telegram')}>
          <FaTelegram style={{ color: '#0088cc' }} /> Telegram
        </button>
        <button className="share-menu-item" onClick={copyLink}>
          <FaLink style={{ color: 'var(--cobalt)' }} /> {t('common.copyLink')}
        </button>
      </div>
    </div>
  );
};

export default ShareMenu;
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose } from 'react-icons/io5';

const EmailModal = ({ isOpen, onClose, onSubmit, title }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    onSubmit({ email, name });
    localStorage.setItem('bluex_user_email', email);
    localStorage.setItem('bluex_user_name', name);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title || t('common.email')}</h3>
          <button className="modal-close" onClick={onClose}><IoClose /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">{t('common.name')}</label>
              <input type="text" className="form-input" value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('common.name')} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.email')}</label>
              <input type="email" className="form-input" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('common.email')} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('common.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
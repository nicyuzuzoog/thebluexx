import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSend, IoHeartOutline, IoChatbubble } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { timeAgo } from '../../utils/helpers';
import api from '../../utils/api';
import EmailModal from './EmailModal';

const CommentSection = ({ newsId, movieId, comments: initialComments }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState(initialComments || []);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingComment, setPendingComment] = useState(null);

  useEffect(() => {
    if (!initialComments) fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const params = newsId ? `newsId=${newsId}` : `movieId=${movieId}`;
      const res = await api.get(`/comments?${params}`);
      setComments(res.data.data);
    } catch (e) { /* */ }
  };

  const getUserInfo = () => ({
    email: localStorage.getItem('bluex_user_email'),
    name: localStorage.getItem('bluex_user_name')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const { email, name } = getUserInfo();
    if (!email || !name) {
      setPendingComment({ content: content.trim(), isReply: false });
      setShowEmailModal(true);
      return;
    }
    await submitComment(content.trim(), email, name);
  };

  const submitComment = async (text, email, name, parentId = null) => {
    setLoading(true);
    try {
      const data = {
        content: text, email, name,
        newsId: newsId || undefined,
        movieId: movieId || undefined,
        parentComment: parentId || undefined
      };
      const res = await api.post('/comments', data);
      if (parentId) {
        setComments(prev => prev.map(c =>
          c._id === parentId
            ? { ...c, replies: [...(c.replies || []), res.data.data] }
            : c
        ));
        setReplyTo(null);
        setReplyContent('');
      } else {
        setComments(prev => [res.data.data, ...prev]);
        setContent('');
      }
      toast.success('Comment posted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post comment');
    } finally { setLoading(false); }
  };

  const handleReply = async (parentId) => {
    if (!replyContent.trim()) return;
    const { email, name } = getUserInfo();
    if (!email || !name) {
      setPendingComment({ content: replyContent.trim(), isReply: true, parentId });
      setShowEmailModal(true);
      return;
    }
    await submitComment(replyContent.trim(), email, name, parentId);
  };

  const handleLikeComment = async (commentId) => {
    const email = localStorage.getItem('bluex_user_email');
    if (!email) { setShowEmailModal(true); return; }
    try {
      const res = await api.post(`/comments/${commentId}/like`, { email });
      setComments(prev => prev.map(c => {
        if (c._id === commentId) return { ...c, likesCount: res.data.likesCount };
        if (c.replies) {
          return {
            ...c, replies: c.replies.map(r =>
              r._id === commentId ? { ...r, likesCount: res.data.likesCount } : r
            )
          };
        }
        return c;
      }));
    } catch (e) { /* */ }
  };

  const handleEmailSubmit = ({ email, name }) => {
    localStorage.setItem('bluex_user_email', email);
    localStorage.setItem('bluex_user_name', name);
    setShowEmailModal(false);
    if (pendingComment) {
      if (pendingComment.isReply) {
        submitComment(pendingComment.content, email, name, pendingComment.parentId);
      } else {
        submitComment(pendingComment.content, email, name);
      }
      setPendingComment(null);
    }
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment._id}
      className={`cs-comment ${isReply ? 'cs-reply' : ''} animate-fadeInUp`}>
      <div className="cs-comment-header">
        <div className="avatar avatar-sm">
          <div className="avatar-placeholder" style={{ fontSize: '0.62rem' }}>
            {comment.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="cs-comment-meta">
          <span className="cs-comment-name">{comment.name}</span>
          <span className="cs-comment-time">{timeAgo(comment.createdAt)}</span>
        </div>
      </div>

      <p className="cs-comment-content">{comment.content}</p>

      <div className="cs-comment-actions">
        <button className="cs-action-btn" onClick={() => handleLikeComment(comment._id)}>
          <IoHeartOutline />
          {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
        </button>
        {!isReply && (
          <button className="cs-action-btn"
            onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}>
            <IoChatbubble /> {t('common.reply')}
          </button>
        )}
      </div>

      {replyTo === comment._id && (
        <div className="cs-reply-form animate-fadeInDown">
          <input type="text" value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={`${t('common.reply')} @${comment.name}...`}
            className="form-input"
            style={{ fontSize: '0.86rem', padding: '8px 12px' }}
            onKeyPress={(e) => e.key === 'Enter' && handleReply(comment._id)} />
          <button className="btn btn-primary btn-sm"
            onClick={() => handleReply(comment._id)} disabled={loading}>
            <IoSend />
          </button>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="cs-replies">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="cs-section">
      <h3 className="cs-section-title">
        <IoChatbubble /> {t('common.comment')} ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="cs-form">
        <textarea value={content} onChange={(e) => setContent(e.target.value)}
          placeholder={t('common.writeComment')}
          className="form-textarea"
          style={{ minHeight: '78px', fontSize: '0.9rem' }}
          maxLength={1000} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.72rem', color: 'var(--text-muted)',
            fontFamily: 'var(--font-display)'
          }}>
            {content.length}/1000
          </span>
          <button type="submit" className="btn btn-primary btn-sm"
            disabled={loading || !content.trim()}>
            {loading
              ? <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div>
              : <><IoSend /> {t('common.submit')}</>}
          </button>
        </div>
      </form>

      <div className="cs-list">
        {comments.length === 0 ? (
          <p style={{
            textAlign: 'center', padding: '28px',
            color: 'var(--text-muted)', fontSize: '0.88rem',
            fontFamily: 'var(--font-display)'
          }}>
            No comments yet. Be the first! 💬
          </p>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        title={t('common.commentRequiresEmail')}
      />

      <style>{`
        .cs-section { margin-top: 28px; }

        .cs-section-title {
          display: flex; align-items: center; gap: 7px;
          font-family: var(--font-display);
          font-size: 1.08rem; font-weight: 700;
          margin-bottom: 16px; letter-spacing: -0.01em;
        }

        .cs-form { margin-bottom: 20px; }
        .cs-form .form-textarea { margin-bottom: 8px; }

        .cs-list { display: flex; flex-direction: column; gap: 12px; }

        .cs-comment {
          padding: 13px;
          border-radius: var(--r-md);
          background: var(--bg-overlay);
          border: 1px solid var(--border-soft);
          transition: border-color var(--dur-fast) var(--ease-out);
        }
        .cs-comment:hover { border-color: rgba(27,79,255,0.1); }
        .cs-reply {
          margin-left: 16px;
          background: var(--bg-surface);
          border-left: 2px solid var(--cobalt);
        }

        .cs-comment-header {
          display: flex; align-items: center;
          gap: 9px; margin-bottom: 7px;
        }
        .cs-comment-meta {
          display: flex; align-items: center; gap: 8px;
        }
        .cs-comment-name {
          font-family: var(--font-display);
          font-weight: 600; font-size: 0.86rem;
        }
        .cs-comment-time {
          font-size: 0.7rem; color: var(--text-muted);
        }

        .cs-comment-content {
          font-family: var(--font-body);
          font-size: 0.88rem; line-height: 1.65;
          color: var(--text-body);
          margin-bottom: 7px;
          word-break: break-word;
        }

        .cs-comment-actions { display: flex; gap: 10px; }
        .cs-action-btn {
          display: flex; align-items: center; gap: 3px;
          background: none; border: none;
          color: var(--text-muted); font-size: 0.78rem;
          cursor: pointer; padding: 2px 6px;
          border-radius: var(--r-xs);
          font-family: var(--font-body);
          transition: all var(--dur-fast) var(--ease-out);
        }
        .cs-action-btn:hover {
          color: var(--cobalt);
          background: rgba(27,79,255,0.05);
        }

        .cs-reply-form {
          display: flex; gap: 7px; margin-top: 9px;
        }
        .cs-reply-form .form-input { flex: 1; }

        .cs-replies {
          margin-top: 10px;
          display: flex; flex-direction: column; gap: 8px;
        }

        @media (max-width: 640px) {
          .cs-reply { margin-left: 10px; }
          .cs-comment { padding: 10px; }
        }
      `}</style>
    </div>
  );
};

export default CommentSection;
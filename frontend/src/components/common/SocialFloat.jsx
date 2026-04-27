import { useState } from 'react';
import { FaWhatsapp, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoClose, IoChatbubbleEllipses } from 'react-icons/io5';

const SocialFloat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="social-float">
      <div className={`social-float-buttons ${isOpen ? 'open' : ''}`}>
        <a href="https://wa.me/?text=Check%20out%20THE%20BLUEX" target="_blank"
          rel="noopener noreferrer" className="social-float-btn whatsapp" title="WhatsApp">
          <FaWhatsapp />
        </a>
        <a href="https://www.instagram.com/" target="_blank"
          rel="noopener noreferrer" className="social-float-btn instagram" title="Instagram">
          <FaInstagram />
        </a>
        <a href="https://twitter.com/" target="_blank"
          rel="noopener noreferrer" className="social-float-btn twitter" title="X (Twitter)">
          <FaXTwitter />
        </a>
        <a href="mailto:thebluex08@gmail.com"
          className="social-float-btn email" title="Email Us">
          <FaEnvelope />
        </a>
      </div>

      <button
        className={`social-float-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle social links"
      >
        {isOpen ? <IoClose /> : <IoChatbubbleEllipses />}
      </button>

      <style>{`
        .social-float {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
        }

        .social-float-buttons {
          display: flex;
          flex-direction: column;
          gap: 9px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(16px) scale(0.85);
          transition: all var(--dur-mid) var(--ease-spring);
        }

        .social-float-buttons.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .social-float-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.25rem;
          transition: all var(--dur-mid) var(--ease-spring);
          box-shadow: var(--shadow-md);
        }

        .social-float-btn:hover {
          transform: scale(1.14);
          box-shadow: var(--shadow-lg);
        }

        .social-float-btn.whatsapp {
          background: linear-gradient(135deg, #25d366, #1aab55);
        }
        .social-float-btn.instagram {
          background: linear-gradient(135deg, #f09433, #dc2743, #bc1888);
        }
        .social-float-btn.twitter {
          background: linear-gradient(135deg, #1a1a2e, #2d2d44);
        }
        .social-float-btn.email {
          background: var(--grad-brand);
        }

        .social-float-buttons.open .social-float-btn {
          animation: bounceIn 0.5s var(--ease-out) forwards;
        }
        .social-float-buttons.open .social-float-btn:nth-child(1) { animation-delay: 0s; }
        .social-float-buttons.open .social-float-btn:nth-child(2) { animation-delay: 0.06s; }
        .social-float-buttons.open .social-float-btn:nth-child(3) { animation-delay: 0.12s; }
        .social-float-buttons.open .social-float-btn:nth-child(4) { animation-delay: 0.18s; }

        .social-float-toggle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--grad-cobalt);
          color: var(--white);
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-cobalt);
          transition: all var(--dur-mid) var(--ease-spring);
          animation: glow 2.5s infinite;
        }

        .social-float-toggle:hover {
          transform: scale(1.08);
        }

        .social-float-toggle.active {
          background: linear-gradient(135deg, var(--crimson), #C0243A);
          transform: rotate(180deg);
          animation: none;
          box-shadow: 0 6px 24px rgba(229,52,74,0.4);
        }

        @media (max-width: 768px) {
          .social-float { bottom: 18px; right: 18px; }
          .social-float-toggle { width: 48px; height: 48px; font-size: 1.3rem; }
          .social-float-btn { width: 40px; height: 40px; font-size: 1.05rem; }
        }
      `}</style>
    </div>
  );
};

export default SocialFloat;
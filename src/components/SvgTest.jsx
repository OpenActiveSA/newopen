import React from 'react';
import '../App.css';
import { Icon } from './Icon';
import { FaLock, FaHeart } from 'react-icons/fa';
import { 
  FiLock, 
  FiMail, 
  FiHeart, 
  FiStar,
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiPhone,
  FiSettings,
  FiSearch,
  FiPlay
} from 'react-icons/fi';

// Local SVG components (inline SVG)
const LockSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M6,11v-5c0-2.8,3.2-4,6-4s6,1.2,6,4v5"></path>
    <line x1="7.4" y1="16.3" x2="7.6" y2="16.3"></line>
    <line x1="10.4" y1="16.3" x2="10.6" y2="16.3"></line>
    <line x1="13.4" y1="16.3" x2="13.6" y2="16.3"></line>
    <line x1="16.4" y1="16.3" x2="16.6" y2="16.3"></line>
  </svg>
);

const MailSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const HeartSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const StarSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
);

const CalendarSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const UserSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MapPinSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const PhoneSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const SettingsSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const SearchSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="M21 21l-4.35-4.35"></path>
  </svg>
);

const PlaySvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5,3 19,12 5,21"></polygon>
  </svg>
);

const BackSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17,21 7,12 17,3"></polyline>
  </svg>
);

// Icon container component
const LineSvg = ({ children, label }) => (
  <div className="svg-container">
    <div className="svg-box">
      {children}
    </div>
    <div className="icon-label">{label}</div>
  </div>
);

export default function SvgTest() {
  return (
    <div className="page">
      <header className="header main-header">
        <div className="header-title">SVG Test</div>
      </header>
      <div className="page-content">
        <div className="section">
          <h2 className="section-label">Local Open Farm Icons</h2>
          <div className="icon-row">
            <LineSvg label="Lock">
              <Icon name="lock" size={32} color="white" />
            </LineSvg>
            <LineSvg label="Mail">
              <Icon name="envelope" size={32} color="white" />
            </LineSvg>
            <LineSvg label="Heart">
              <HeartSvg />
            </LineSvg>
            <LineSvg label="Star">
              <StarSvg />
            </LineSvg>
            <LineSvg label="Calendar">
              <CalendarSvg />
            </LineSvg>
            <LineSvg label="Clock">
              <ClockSvg />
            </LineSvg>
            <LineSvg label="User">
              <UserSvg />
            </LineSvg>
            <LineSvg label="Location">
              <MapPinSvg />
            </LineSvg>
            <LineSvg label="Phone">
              <PhoneSvg />
            </LineSvg>
            <LineSvg label="Settings">
              <SettingsSvg />
            </LineSvg>
            <LineSvg label="Search">
              <SearchSvg />
            </LineSvg>
                <LineSvg label="Play">
                  <PlaySvg />
                </LineSvg>
                <LineSvg label="Back">
                  <BackSvg />
                </LineSvg>
          </div>
        </div>
      </div>
      <footer className="footer main-footer">
        <div className="footer-content">
          <div>Open Farm Tennis Booking System</div>
          <div>SVG Test Page</div>
        </div>
      </footer>
    </div>
  );
}


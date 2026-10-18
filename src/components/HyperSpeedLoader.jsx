import React from 'react';
import './HyperSpeedLoader.css';

const HyperSpeedLoader = ({ 
  visible = true, 
  message = "PROCESSING REQUEST", 
  subtitle = "SYNCHRONIZING WITH GLOBAL NEURAL NETWORKS"
}) => {
  if (!visible) return null;

  return (
    <div 
      className="hs-loader-screen" 
      role="status" 
      aria-live="polite"
      aria-label={message}
    >
      <div className="hs-noise-bg"></div>
      
      {/* Background long lines */}
      <div className="hs-longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Main loader container */}
      <div className="hs-loader-container">
        <div className="hs-loader">
          {/* Speed lines behind character */}
          <div className="hs-speed-lines">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {/* Character base */}
          <div className="hs-loader-base">
            <div className="hs-loader-face"></div>
          </div>
        </div>

        {/* Processing text */}
        <div className="hs-text-container">
          <h1 className="hs-main-text">{message}</h1>
          <p className="hs-sub-text">{subtitle}</p>
        </div>

        {/* Progress bar */}
        <div className="hs-loader-progress">
          <div className="hs-progress-track">
            <div className="hs-progress-bar"></div>
          </div>
        </div>

        {/* Technical status labels */}
        <div className="hs-status-container">
          <div className="hs-status-left">
            <div className="hs-status-item">
              <svg className="hs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>SYSTEMS NOMINAL</span>
            </div>
            <div className="hs-status-item">
              <span>X-RAY DELTA 4.0 // VECTOR PROTOCOL</span>
            </div>
          </div>
          <div className="hs-status-right">
            <div className="hs-status-item">
              <span>LATENCY: 14ms</span>
            </div>
            <div className="hs-status-item hs-brand">
              <svg className="hs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
              <span>VELOCITY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyperSpeedLoader;
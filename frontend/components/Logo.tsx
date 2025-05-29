import React from 'react';

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 40 }) => {
  return (
    <div 
      className="logo-container" 
      style={{ 
        width: size, 
        height: size 
      }}
    >
      <div className="logo-circle">
        <span className="logo-text">YM</span>
      </div>
      <style jsx>{`
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 100;
        }
        
        .logo-circle {
          background-color: #1b263b;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(58, 193, 184, 0.2);
          border: 1px solid rgba(58, 193, 184, 0.3);
          overflow: hidden;
          position: relative;
        }
        
        .logo-circle::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(58, 193, 184, 0.2) 0%, transparent 60%);
          z-index: 1;
        }
        
        .logo-text {
          color: #ffffff;
          font-weight: 700;
          font-size: ${size * 0.45}px;
          letter-spacing: -0.5px;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default Logo; 
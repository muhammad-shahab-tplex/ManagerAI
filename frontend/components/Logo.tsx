import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 100, 
  showText = false, 
  className = '', 
  textClassName = '',
  iconClassName = ''
}) => {
  return (
    <div className={`logo-container ${className}`}>
      <div className={`logo-icon ${iconClassName}`}>
        <svg 
          version="1.0" 
          xmlns="http://www.w3.org/2000/svg"
          width={size} 
          height={size} 
          viewBox="0 0 1024.000000 1024.000000"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: size, height: size }}
        >
          <g 
            transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
            fill="currentColor" 
            stroke="none"
          >
            <path d="M5885 7141 c-78 -5 -108 -11 -135 -28 -19 -12 -196 -183 -392 -380
            l-358 -359 0 -44 c0 -44 1 -46 148 -192 146 -145 150 -148 193 -148 l44 0 507
            507 c358 358 511 517 519 541 12 37 -4 72 -43 93 -27 14 -326 21 -483 10z"/>
            <path d="M3240 7129 c-44 -18 -60 -40 -60 -83 0 -40 3 -43 660 -701 366 -367
            664 -673 670 -688 6 -18 10 -177 10 -435 0 -224 5 -425 10 -446 5 -22 20 -51
            35 -65 l25 -26 208 -3 c186 -2 210 -1 242 16 72 39 71 23 68 622 -2 421 -6
            540 -16 561 -23 43 -1215 1215 -1260 1238 -39 20 -56 21 -304 20 -148 0 -274
            -5 -288 -10z"/>
            <path d="M6792 7064 c-18 -9 -319 -305 -668 -657 -681 -687 -665 -670 -644
            -749 15 -51 216 -244 265 -254 69 -13 79 -5 380 296 160 160 298 290 307 290
            10 0 22 -9 28 -19 6 -13 10 -219 10 -601 0 -620 0 -621 50 -665 20 -18 39 -20
            205 -23 168 -3 187 -1 223 17 78 40 73 -44 70 1185 -3 1088 -3 1095 -24 1122
            -50 67 -135 92 -202 58z"/>
          </g>
        </svg>
      </div>
      {showText && (
        <span className={`logo-text ${textClassName}`}>
          ManagerAI
        </span>
      )}
    </div>
  );
};

export default Logo; 
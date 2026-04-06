import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 40, 
  showText = true,
  textColor = "text-on-surface"
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        style={{ width: size, height: size }}
        className="relative shrink-0"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gold Circle/Coin Background */}
          <circle cx="50" cy="50" r="45" fill="#FDB913" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="40" stroke="#FDB913" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* The "M" Shape - Forest Green */}
          <path
            d="M20 75V25L50 50L80 25V75"
            stroke="#006837"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* The Circular Arrow - Forest Green */}
          <path
            d="M15 60C10 50 10 35 20 25"
            stroke="#006837"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M85 40C90 50 90 65 80 75C70 85 50 90 30 85"
            stroke="#006837"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Arrow Head */}
          <path
            d="M25 80L30 85L25 90"
            stroke="#006837"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Small Gold Coin Detail */}
          <circle cx="75" cy="65" r="12" fill="#FDB913" />
          <text 
            x="75" 
            y="69" 
            fill="white" 
            fontSize="12" 
            fontWeight="bold" 
            textAnchor="middle"
          >$</text>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-xl sm:text-2xl font-headline font-black tracking-tighter ${textColor}`}>
            Mara<span className="text-primary">Cash</span>
          </span>
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-secondary">
            Maranhão
          </span>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { AlertOctagon } from 'lucide-react';

interface SOSButtonProps {
  onTrigger: () => void;
  className?: string;
  variant?: 'full' | 'icon';
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onTrigger, className = '', variant = 'full' }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const PRESS_DURATION = 3000; // 3 seconds

  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid scrolling/context menu while holding
    // e.preventDefault(); 
    setIsPressing(true);
    const startTime = Date.now();

    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / PRESS_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(intervalRef.current!);
        setIsPressing(false);
        setProgress(0);
        onTrigger();
      }
    }, 16);
  };

  const endPress = () => {
    setIsPressing(false);
    setProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className={`relative ${className} no-tap-highlight`}>
      <button
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        className={`relative overflow-hidden transition-all duration-200 ${
          variant === 'full' 
            ? 'w-full bg-red-50 text-red-600 border border-red-100 hover:border-red-200 py-3 rounded-xl flex items-center justify-center font-bold' 
            : 'w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30'
        } ${isPressing ? 'scale-95' : ''}`}
      >
        {/* Background Fill Animation */}
        <div 
          className="absolute inset-0 bg-red-600 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%`, opacity: variant === 'full' ? 0.1 : 1 }}
        />
        
        <div className="relative z-10 flex items-center">
          <AlertOctagon size={variant === 'full' ? 20 : 20} className={variant === 'full' ? "mr-2" : ""} />
          {variant === 'full' && <span>{isPressing ? 'HOLD TO ACTIVATE...' : 'SOS EMERGENCY'}</span>}
        </div>
      </button>
      
      {/* Circular Progress Overlay for Icon Variant */}
      {variant === 'icon' && isPressing && (
        <svg className="absolute -top-1 -left-1 w-12 h-12 pointer-events-none transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            strokeDasharray="138"
            strokeDashoffset={138 - (138 * progress) / 100}
          />
        </svg>
      )}
    </div>
  );
};
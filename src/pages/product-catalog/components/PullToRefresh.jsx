import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PullToRefresh = ({ 
  onRefresh, 
  children, 
  threshold = 80,
  className = '' 
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling || window.scrollY > 0) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    currentY.current = e.touches[0].clientY;
    const distance = Math.max(0, currentY.current - startY.current);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling && pullDistance >= threshold && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Error during refresh:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, threshold]);

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Pull to Refresh Indicator */}
      <div 
        className={`absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 ease-out ${
          isPulling || isRefreshing ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          height: `${Math.max(pullDistance * 0.8, isRefreshing ? 60 : 0)}px`,
          transform: `translateY(${isPulling ? 0 : isRefreshing ? 0 : '-100%'})`
        }}
      >
        <div className="flex flex-col items-center space-y-2 py-4">
          <div 
            className={`transition-transform duration-200 ${
              isRefreshing ? 'animate-spin' : shouldTrigger ? 'rotate-180' : ''
            }`}
          >
            <Icon 
              name={isRefreshing ? "Loader2" : "ArrowDown"} 
              size={24} 
              color="var(--color-primary)" 
            />
          </div>
          <span className="text-sm text-primary font-medium">
            {isRefreshing 
              ? 'Actualizando productos...' 
              : shouldTrigger 
                ? 'Suelta para actualizar' :'Desliza hacia abajo'
            }
          </span>
        </div>
      </div>

      {/* Content */}
      <div 
        style={{
          transform: `translateY(${isPulling ? pullDistance * 0.8 : isRefreshing ? 60 : 0}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
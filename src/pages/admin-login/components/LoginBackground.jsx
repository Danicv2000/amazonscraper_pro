import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-secondary-50"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-10">
        <Icon name="BarChart3" size={120} color="var(--color-primary)" />
      </div>
      
      <div className="absolute top-20 right-20 opacity-10">
        <Icon name="TrendingUp" size={80} color="var(--color-accent)" />
      </div>
      
      <div className="absolute bottom-20 left-20 opacity-10">
        <Icon name="ShoppingBag" size={100} color="var(--color-secondary)" />
      </div>
      
      <div className="absolute bottom-10 right-10 opacity-10">
        <Icon name="Package" size={90} color="var(--color-primary)" />
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-secondary-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
    </div>
  );
};

export default LoginBackground;
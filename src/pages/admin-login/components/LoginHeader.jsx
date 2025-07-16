import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-elevation-2">
            <Icon name="BarChart3" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-heading font-bold text-primary">
              AmazonScraper
            </h1>
            <p className="text-sm text-text-secondary font-medium -mt-1">
              Pro Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-bold text-text-primary">
          Bienvenido de vuelta
        </h2>
        <p className="text-text-secondary">
          Accede a tu panel de administración para gestionar pedidos y analizar ventas
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;
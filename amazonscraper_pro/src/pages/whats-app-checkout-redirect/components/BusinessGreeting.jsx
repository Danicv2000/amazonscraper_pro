import React from 'react';
import Icon from '../../../components/AppIcon';

const BusinessGreeting = ({ className = '' }) => {
  return (
    <div className={`bg-surface rounded-lg border border-border shadow-elevation-2 ${className}`}>
      <div className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ShoppingBag" size={32} color="white" />
          </div>
          
          <h1 className="text-2xl font-bold text-primary mb-2">
            AmazonScraper Pro
          </h1>
          
          <p className="text-text-secondary mb-6">
            Tu tienda de confianza para productos de Amazon
          </p>
          
          <div className="bg-background rounded-lg p-4 border border-border-light">
            <div className="flex items-start space-x-3">
              <Icon name="MessageSquare" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary mb-2">
                  ¡Hola! Gracias por elegir AmazonScraper Pro
                </p>
                <p className="text-sm text-text-secondary">
                  Estamos preparando tu pedido para enviártelo por WhatsApp. 
                  Nuestro equipo te ayudará a completar la compra de forma rápida y segura.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="Shield" size={20} color="var(--color-success)" />
              </div>
              <p className="text-xs text-text-secondary">Compra Segura</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="Truck" size={20} color="var(--color-primary)" />
              </div>
              <p className="text-xs text-text-secondary">Envío Rápido</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="Headphones" size={20} color="var(--color-accent)" />
              </div>
              <p className="text-xs text-text-secondary">Soporte 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessGreeting;
import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OrderSummaryCard = ({ items = [], total = 0, className = '' }) => {
  const formatPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`bg-surface rounded-lg border border-border shadow-elevation-2 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Resumen del Pedido</h2>
          <div className="flex items-center space-x-2">
            <Icon name="ShoppingBag" size={20} color="var(--color-primary)" />
            <span className="text-sm text-text-secondary">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 bg-background rounded-lg border border-border-light">
              <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-primary line-clamp-2 mb-1">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Cantidad: {item.quantity}
                  </span>
                  <div className="text-right">
                    <p className="font-data font-bold text-primary">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-text-muted">
                        {formatPrice(item.price, item.currency)} c/u
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-6 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-text-primary">Total:</span>
            <span className="text-2xl font-data font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  loading = false,
  className = '' 
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const formatPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const calculateDiscount = (original, current) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      if (onRemove) {
        await onRemove(item.id);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsRemoving(false);
      setShowConfirmDialog(false);
    }
  };

  const itemTotal = item.price * item.quantity;
  const originalTotal = item.originalPrice ? item.originalPrice * item.quantity : null;
  const discount = calculateDiscount(item.originalPrice, item.price);

  return (
    <>
      <div className={`bg-surface rounded-lg border border-border p-4 transition-smooth ${loading ? 'opacity-50' : ''} ${className}`}>
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <div className="w-full h-full bg-secondary-100 rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-text-primary line-clamp-2 pr-2">
                {item.title}
              </h3>
              <Button
                variant="ghost"
                onClick={() => setShowConfirmDialog(true)}
                iconName="Trash2"
                className="p-1 w-8 h-8 text-text-secondary hover:text-error hover:bg-error-50 flex-shrink-0"
                aria-label="Eliminar producto"
                disabled={loading || isRemoving}
              />
            </div>

            {/* Price Information */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-data font-bold text-primary text-lg">
                {formatPrice(item.price, item.currency)}
              </span>
              {originalTotal && (
                <>
                  <span className="font-data text-text-secondary line-through text-sm">
                    {formatPrice(item.originalPrice, item.currency)}
                  </span>
                  <span className="bg-error text-error-foreground px-1.5 py-0.5 rounded text-xs font-medium">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 mb-3">
              {item.inStock ? (
                <div className="flex items-center space-x-1">
                  <Icon name="Check" size={14} color="var(--color-success)" />
                  <span className="text-xs text-success font-medium">En stock</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Icon name="AlertCircle" size={14} color="var(--color-warning)" />
                  <span className="text-xs text-warning font-medium">Stock limitado</span>
                </div>
              )}
              
              {item.freeShipping && (
                <div className="flex items-center space-x-1">
                  <Icon name="Truck" size={14} color="var(--color-success)" />
                  <span className="text-xs text-success font-medium">Envío gratis</span>
                </div>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-text-secondary">Cantidad:</span>
                <div className="flex items-center space-x-2 bg-background border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    iconName="Minus"
                    className="p-2 w-8 h-8 hover:bg-secondary-100"
                    disabled={item.quantity <= 1 || loading}
                    aria-label="Reducir cantidad"
                  />
                  <span className="font-data font-medium w-8 text-center text-text-primary">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    iconName="Plus"
                    className="p-2 w-8 h-8 hover:bg-secondary-100"
                    disabled={item.quantity >= 99 || loading}
                    aria-label="Aumentar cantidad"
                  />
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <div className="font-data font-bold text-primary text-lg">
                  {formatPrice(itemTotal, item.currency)}
                </div>
                {originalTotal && originalTotal > itemTotal && (
                  <div className="font-data text-text-secondary line-through text-sm">
                    {formatPrice(originalTotal, item.currency)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowConfirmDialog(false)} />
          <div className="relative bg-surface rounded-lg border border-border p-6 max-w-sm w-full shadow-elevation-4">
            <div className="text-center">
              <Icon name="AlertTriangle" size={48} color="var(--color-warning)" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                ¿Eliminar producto?
              </h3>
              <p className="text-text-secondary mb-6">
                ¿Estás seguro de que quieres eliminar "{item.title}" del carrito?
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1"
                  disabled={isRemoving}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRemove}
                  loading={isRemoving}
                  iconName="Trash2"
                  iconPosition="left"
                  className="flex-1"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItem;
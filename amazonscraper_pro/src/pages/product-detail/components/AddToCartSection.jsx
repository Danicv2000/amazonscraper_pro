import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import QuantitySelector from './QuantitySelector';

const AddToCartSection = ({ 
  product = {}, 
  onAddToCart, 
  className = '',
  isSticky = false 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock product data if none provided
  const mockProduct = {
    id: '1',
    title: "Smartphone Samsung Galaxy A54 5G 128GB",
    price: 299.99,
    currency: 'EUR',
    availability: 'En stock',
    maxQuantity: 5
  };

  const displayProduct = Object.keys(product).length > 0 ? product : mockProduct;

  const formatPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (displayProduct.availability !== 'En stock') return;
    
    setIsAdding(true);
    
    try {
      const cartItem = {
        ...displayProduct,
        quantity: quantity,
        totalPrice: displayProduct.price * quantity
      };

      if (onAddToCart) {
        await onAddToCart(cartItem);
      } else {
        // Mock add to cart delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    // Add to cart and redirect to checkout
    handleAddToCart().then(() => {
      // In real app, this would navigate to checkout
      window.location.href = '/shopping-cart';
    });
  };

  const totalPrice = displayProduct.price * quantity;
  const isOutOfStock = displayProduct.availability !== 'En stock';

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 space-y-4 ${
      isSticky ? 'sticky bottom-0 shadow-elevation-3 z-50' : ''
    } ${className}`}>
      
      {/* Price Display */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-data font-bold text-primary">
            {formatPrice(totalPrice, displayProduct.currency)}
          </span>
          {quantity > 1 && (
            <div className="text-sm text-text-secondary">
              {formatPrice(displayProduct.price, displayProduct.currency)} × {quantity}
            </div>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="flex items-center space-x-2">
          <Icon 
            name={isOutOfStock ? "AlertCircle" : "CheckCircle"} 
            size={16} 
            color={isOutOfStock ? "var(--color-warning)" : "var(--color-success)"} 
          />
          <span className={`text-sm font-medium ${
            isOutOfStock ? 'text-warning' : 'text-success'
          }`}>
            {displayProduct.availability}
          </span>
        </div>
      </div>

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <QuantitySelector
          initialQuantity={quantity}
          maxQuantity={displayProduct.maxQuantity || 10}
          onQuantityChange={handleQuantityChange}
          disabled={isAdding}
        />
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isOutOfStock ? (
          <>
            {/* Add to Cart Button */}
            <Button
              variant="primary"
              onClick={handleAddToCart}
              loading={isAdding}
              disabled={isOutOfStock}
              iconName={showSuccess ? "Check" : "ShoppingCart"}
              iconPosition="left"
              fullWidth
              className="h-12 text-lg font-semibold"
            >
              {showSuccess ? '¡Añadido al carrito!' : 
               isAdding ? 'Añadiendo...' : 'Añadir al carrito'}
            </Button>

            {/* Buy Now Button */}
            <Button
              variant="secondary"
              onClick={handleBuyNow}
              disabled={isAdding || isOutOfStock}
              iconName="Zap"
              iconPosition="left"
              fullWidth
              className="h-12 text-lg font-semibold"
            >
              Comprar ahora
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            disabled
            iconName="AlertCircle"
            iconPosition="left"
            fullWidth
            className="h-12 text-lg font-semibold"
          >
            No disponible
          </Button>
        )}
      </div>

      {/* Additional Info */}
      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={14} />
            <span>Compra segura</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="RotateCcw" size={14} />
            <span>Devolución gratuita</span>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-300 pointer-events-none">
          <div className="bg-success text-success-foreground px-6 py-3 rounded-lg shadow-elevation-3 flex items-center space-x-2 animate-bounce">
            <Icon name="Check" size={20} />
            <span className="font-medium">¡Producto añadido!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCartSection;
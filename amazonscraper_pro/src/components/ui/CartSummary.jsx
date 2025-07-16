import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const CartSummary = ({ items = [], onUpdateQuantity, onRemove, onCheckout, className = '' }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock cart items if none provided
  const mockItems = [
    {
      id: '1',
      name: 'Smartphone Samsung Galaxy A54',
      price: 299.99,
      quantity: 1,
      image: '/assets/images/no_image.png',
      currency: 'EUR'
    },
    {
      id: '2',
      name: 'Auriculares Bluetooth Sony WH-1000XM4',
      price: 249.99,
      quantity: 2,
      image: '/assets/images/no_image.png',
      currency: 'EUR'
    }
  ];

  const cartItems = items.length > 0 ? items : mockItems;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.21; // 21% IVA
  const total = subtotal + shipping + tax;

  const formatPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    if (onUpdateQuantity) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    if (onRemove) {
      onRemove(itemId);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      if (onCheckout) {
        await onCheckout(cartItems, total);
      } else {
        // Default behavior - navigate to WhatsApp checkout
        const message = `¡Hola! Me interesa realizar este pedido:\n\n${cartItems.map(item => 
          `• ${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}`
        ).join('\n')}\n\nTotal: ${formatPrice(total)}\n\n¿Podrían ayudarme con el proceso de compra?`;
        
        const whatsappUrl = `https://wa.me/34600000000?text=${encodeURIComponent(message)}`;
        navigate('/whats-app-checkout-redirect', { 
          state: { 
            whatsappUrl, 
            orderSummary: { items: cartItems, total } 
          } 
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/product-catalog');
  };

  if (cartItems.length === 0) {
    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-elevation-3 z-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center">
            <Icon name="ShoppingCart" size={48} color="var(--color-text-muted)" className="mx-auto mb-2" />
            <p className="text-text-secondary mb-4">Tu carrito está vacío</p>
            <Button
              variant="primary"
              onClick={handleContinueShopping}
              iconName="ShoppingBag"
              iconPosition="left"
            >
              Explorar Productos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-elevation-3 z-100 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Expandable Summary Header */}
        <div 
          className="px-4 py-4 cursor-pointer transition-smooth hover:bg-secondary-50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Icon name="ShoppingCart" size={24} color="var(--color-primary)" />
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </p>
                <p className="text-sm text-text-secondary">
                  Total: <span className="font-data font-bold text-primary">{formatPrice(total)}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout();
                }}
                loading={isProcessing}
                iconName="MessageCircle"
                iconPosition="left"
                className="hidden sm:flex"
              >
                Pedir por WhatsApp
              </Button>
              
              <Button
                variant="ghost"
                iconName={isExpanded ? "ChevronDown" : "ChevronUp"}
                className="p-2"
                aria-label={isExpanded ? "Contraer" : "Expandir"}
              />
            </div>
          </div>
        </div>

        {/* Expanded Cart Details */}
        {isExpanded && (
          <div className="border-t border-border bg-background animate-slide-up max-h-96 overflow-y-auto">
            <div className="px-4 py-4">
              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-surface p-3 rounded-lg border border-border">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">{item.name}</p>
                      <p className="text-sm font-data text-primary font-bold">
                        {formatPrice(item.price, item.currency)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        iconName="Minus"
                        className="p-1 w-8 h-8"
                        disabled={item.quantity <= 1}
                      />
                      <span className="font-data font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        iconName="Plus"
                        className="p-1 w-8 h-8"
                      />
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveItem(item.id)}
                        iconName="Trash2"
                        className="p-1 w-8 h-8 text-error hover:text-error-700 hover:bg-error-50"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-surface p-4 rounded-lg border border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal:</span>
                  <span className="font-data">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Envío:</span>
                  <span className="font-data">
                    {shipping === 0 ? (
                      <span className="text-success">Gratis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">IVA (21%):</span>
                  <span className="font-data">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-text-primary">Total:</span>
                    <span className="font-data text-primary text-lg">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={handleContinueShopping}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  className="flex-1"
                >
                  Seguir Comprando
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCheckout}
                  loading={isProcessing}
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="flex-1"
                >
                  Pedir por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Checkout Button */}
        <div className="sm:hidden px-4 pb-4">
          <Button
            variant="primary"
            onClick={handleCheckout}
            loading={isProcessing}
            iconName="MessageCircle"
            iconPosition="left"
            fullWidth
          >
            Pedir por WhatsApp - {formatPrice(total)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderSummary = ({ 
  items = [], 
  onCheckout, 
  loading = false,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Shipping calculation
  const freeShippingThreshold = 50;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 5.99;
  const freeShippingRemaining = freeShippingThreshold - subtotal;
  
  // Tax calculation (21% IVA)
  const taxRate = 0.21;
  const tax = subtotal * taxRate;
  
  // Final total
  const total = subtotal + shippingCost + tax;

  // Savings calculation
  const originalSubtotal = items.reduce((sum, item) => {
    const originalPrice = item.originalPrice || item.price;
    return sum + (originalPrice * item.quantity);
  }, 0);
  const totalSavings = originalSubtotal - subtotal;

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      if (onCheckout) {
        await onCheckout(items, total);
      } else {
        // Generate WhatsApp message
        const message = generateWhatsAppMessage(items, total);
        const whatsappUrl = `https://wa.me/34600000000?text=${encodeURIComponent(message)}`;
        
        navigate('/whats-app-checkout-redirect', { 
          state: { 
            whatsappUrl, 
            orderSummary: { items, total, subtotal, tax, shippingCost } 
          } 
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateWhatsAppMessage = (items, total) => {
    const greeting = "¡Hola! Me interesa realizar este pedido desde AmazonScraper Pro:";
    
    const itemsList = items.map(item => 
      `• ${item.title}\n  Cantidad: ${item.quantity}\n  Precio: ${formatPrice(item.price * item.quantity)}\n  ${item.amazonUrl ? `Link: ${item.amazonUrl}` : ''}`
    ).join('\n\n');
    
    const summary = `\n📋 RESUMEN DEL PEDIDO:\n` +
      `Subtotal: ${formatPrice(subtotal)}\n` +
      `Envío: ${shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}\n` +
      `IVA (21%): ${formatPrice(tax)}\n` +
      `TOTAL: ${formatPrice(total)}`;
    
    const footer = `\n¿Podrían ayudarme con el proceso de compra? ¡Gracias!`;
    
    return `${greeting}\n\n${itemsList}${summary}${footer}`;
  };

  const handleContinueShopping = () => {
    navigate('/product-catalog');
  };

  return (
    <div className={`bg-surface rounded-lg border border-border p-6 sticky top-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Resumen del pedido</h2>
        <div className="flex items-center space-x-1">
          <Icon name="ShoppingCart" size={20} color="var(--color-primary)" />
          <span className="font-medium text-primary">{totalItems}</span>
        </div>
      </div>

      {/* Items Summary */}
      <div className="space-y-3 mb-6">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 bg-secondary-100 rounded flex-shrink-0 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary truncate">{item.title}</p>
              <p className="text-text-secondary">Cantidad: {item.quantity}</p>
            </div>
            <span className="font-data text-primary font-medium">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
        
        {items.length > 3 && (
          <div className="text-center text-sm text-text-secondary">
            +{items.length - 3} productos más
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Subtotal ({totalItems} productos):</span>
          <span className="font-data">{formatPrice(subtotal)}</span>
        </div>
        
        {totalSavings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-success">Ahorros:</span>
            <span className="font-data text-success">-{formatPrice(totalSavings)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Envío:</span>
          <span className="font-data">
            {shippingCost === 0 ? (
              <span className="text-success font-medium">GRATIS</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>
        
        {freeShippingRemaining > 0 && shippingCost > 0 && (
          <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Truck" size={16} color="var(--color-accent)" />
              <span className="text-xs text-accent-700">
                Añade {formatPrice(freeShippingRemaining)} más para envío gratis
              </span>
            </div>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">IVA (21%):</span>
          <span className="font-data">{formatPrice(tax)}</span>
        </div>
        
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-text-primary">Total:</span>
            <span className="font-data font-bold text-primary text-xl">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-success-50 border border-success-200 rounded-lg p-3 mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span className="text-xs text-success-700 font-medium">
            Compra segura a través de WhatsApp
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={handleCheckout}
          loading={isProcessing || loading}
          iconName="MessageCircle"
          iconPosition="left"
          fullWidth
          className="text-base py-3"
        >
          Proceder con WhatsApp
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleContinueShopping}
          iconName="ArrowLeft"
          iconPosition="left"
          fullWidth
        >
          Continuar comprando
        </Button>
      </div>

      {/* Payment Methods Info */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-text-secondary text-center mb-3">
          Métodos de pago disponibles:
        </p>
        <div className="flex justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="CreditCard" size={16} color="var(--color-text-secondary)" />
            <span className="text-xs text-text-secondary">Tarjeta</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Banknote" size={16} color="var(--color-text-secondary)" />
            <span className="text-xs text-text-secondary">Efectivo</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Smartphone" size={16} color="var(--color-text-secondary)" />
            <span className="text-xs text-text-secondary">Bizum</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from '../../components/ui/CustomerHeader';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import BulkActions from './components/BulkActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock cart data - in real app this would come from CartContext or API
  const mockCartItems = [
    {
      id: '1',
      title: 'Smartphone Samsung Galaxy A54 5G 128GB - Negro',
      price: 299.99,
      originalPrice: 349.99,
      currency: 'EUR',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      inStock: true,
      freeShipping: true,
      amazonUrl: 'https://amazon.es/dp/B0C1234567'
    },
    {
      id: '2',
      title: 'Auriculares Bluetooth Sony WH-1000XM4 - Cancelación de ruido',
      price: 249.99,
      originalPrice: 299.99,
      currency: 'EUR',
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      inStock: true,
      freeShipping: true,
      amazonUrl: 'https://amazon.es/dp/B0C2345678'
    },
    {
      id: '3',
      title: 'Tablet iPad Air 10.9" 64GB WiFi - Azul cielo',
      price: 599.99,
      currency: 'EUR',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      inStock: false,
      freeShipping: false,
      amazonUrl: 'https://amazon.es/dp/B0C3456789'
    }
  ];

  // Initialize cart from localStorage or mock data
  useEffect(() => {
    const initializeCart = () => {
      try {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
        } else {
          setCartItems(mockCartItems);
          localStorage.setItem('shoppingCart', JSON.stringify(mockCartItems));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems(mockCartItems);
      } finally {
        setLoading(false);
      }
    };

    initializeCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading && cartItems.length >= 0) {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, selected) => {
    if (selected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleRemoveSelected = async (itemIds) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCartItems(prev => prev.filter(item => !itemIds.includes(item.id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Error removing selected items:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCartItems([]);
      setSelectedItems([]);
      localStorage.removeItem('shoppingCart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCheckout = async (items, total) => {
    try {
      // Generate WhatsApp message
      const message = generateWhatsAppMessage(items, total);
      const whatsappUrl = `https://wa.me/34600000000?text=${encodeURIComponent(message)}`;
      
      // Navigate to WhatsApp redirect page
      navigate('/whats-app-checkout-redirect', { 
        state: { 
          whatsappUrl, 
          orderSummary: { 
            items, 
            total,
            subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
          } 
        } 
      });
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const generateWhatsAppMessage = (items, total) => {
    const greeting = "¡Hola! Me interesa realizar este pedido desde AmazonScraper Pro:";
    
    const itemsList = items.map(item => 
      `• ${item.title}\n  Cantidad: ${item.quantity}\n  Precio: ${formatPrice(item.price * item.quantity)}\n  ${item.amazonUrl ? `Link: ${item.amazonUrl}` : ''}`
    ).join('\n\n');
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.21;
    
    const summary = `\n📋 RESUMEN DEL PEDIDO:\n` +
      `Subtotal: ${formatPrice(subtotal)}\n` +
      `Envío: ${shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}\n` +
      `IVA (21%): ${formatPrice(tax)}\n` +
      `TOTAL: ${formatPrice(total)}`;
    
    const footer = `\n¿Podrían ayudarme con el proceso de compra? ¡Gracias!`;
    
    return `${greeting}\n\n${itemsList}${summary}${footer}`;
  };

  const formatPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-surface rounded-lg border border-border p-4">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-secondary-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                        <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                        <div className="h-6 bg-secondary-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-4">
                <div className="bg-surface rounded-lg border border-border p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-secondary-200 rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-secondary-200 rounded"></div>
                      <div className="h-4 bg-secondary-200 rounded"></div>
                      <div className="h-4 bg-secondary-200 rounded"></div>
                    </div>
                    <div className="h-12 bg-secondary-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Carrito de compras</h1>
            {cartItems.length > 0 && (
              <p className="text-text-secondary mt-1">
                {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            )}
          </div>
          
          {cartItems.length > 1 && (
            <Button
              variant="ghost"
              onClick={() => setShowBulkActions(!showBulkActions)}
              iconName={showBulkActions ? "ChevronUp" : "Settings"}
              iconPosition="left"
              className="hidden sm:flex"
            >
              {showBulkActions ? 'Ocultar opciones' : 'Opciones avanzadas'}
            </Button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              {/* Bulk Actions */}
              {showBulkActions && (
                <BulkActions
                  items={cartItems}
                  selectedItems={selectedItems}
                  onSelectAll={handleSelectAll}
                  onSelectItem={handleSelectItem}
                  onRemoveSelected={handleRemoveSelected}
                  onClearCart={handleClearCart}
                  className="mb-6"
                />
              )}

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    loading={updating[item.id]}
                  />
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden mt-6 space-y-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/product-catalog')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  fullWidth
                >
                  Continuar comprando
                </Button>
                
                {cartItems.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    iconName="Settings"
                    iconPosition="left"
                    fullWidth
                  >
                    Opciones avanzadas
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <OrderSummary
                items={cartItems}
                onCheckout={handleCheckout}
                loading={Object.values(updating).some(Boolean)}
              />
            </div>
          </div>
        )}

        {/* Trust Signals */}
        {cartItems.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={24} color="var(--color-success)" />
                </div>
                <h3 className="font-semibold text-text-primary">Compra segura</h3>
                <p className="text-sm text-text-secondary">
                  Tus datos están protegidos con encriptación SSL
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="MessageCircle" size={24} color="var(--color-primary)" />
                </div>
                <h3 className="font-semibold text-text-primary">Soporte 24/7</h3>
                <p className="text-sm text-text-secondary">
                  Atención al cliente disponible todos los días
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                  <Icon name="Truck" size={24} color="var(--color-accent)" />
                </div>
                <h3 className="font-semibold text-text-primary">Envío rápido</h3>
                <p className="text-sm text-text-secondary">
                  Entrega en 24-48h y envío gratis desde 50€
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShoppingCart;
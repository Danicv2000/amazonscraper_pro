import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomerHeader from '../../components/ui/CustomerHeader';
import OrderSummaryCard from './components/OrderSummaryCard';
import WhatsAppMessagePreview from './components/WhatsAppMessagePreview';
import WhatsAppActions from './components/WhatsAppActions';
import ProgressIndicator from './components/ProgressIndicator';
import BusinessGreeting from './components/BusinessGreeting';

const WhatsAppCheckoutRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Get order data from location state or use mock data
  const orderData = location.state || {
    orderSummary: {
      items: [
        {
          id: '1',
          name: 'Smartphone Samsung Galaxy A54 5G 128GB',
          price: 299.99,
          quantity: 1,
          image: '/assets/images/no_image.png',
          currency: 'EUR',
          amazonUrl: 'https://amazon.es/dp/B0C1EXAMPLE1'
        },
        {
          id: '2',
          name: 'Auriculares Bluetooth Sony WH-1000XM4',
          price: 249.99,
          quantity: 2,
          image: '/assets/images/no_image.png',
          currency: 'EUR',
          amazonUrl: 'https://amazon.es/dp/B0C1EXAMPLE2'
        }
      ],
      total: 799.97
    },
    whatsappUrl: ''
  };

  const { items, total } = orderData.orderSummary;
  const businessPhone = '+53 5552829';
  const businessName = 'AmazonScraper Pro';

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const generateWhatsAppMessage = () => {
    const greeting = `¡Hola! Soy cliente de ${businessName} y me gustaría realizar este pedido:\n\n`;
    
    const productList = items.map((item, index) => {
      const itemTotal = item.price * item.quantity;
      return `${index + 1}. ${item.name}\n   • Cantidad: ${item.quantity}\n   • Precio: ${formatPrice(itemTotal, item.currency)}\n   • Enlace: ${item.amazonUrl || 'Disponible bajo solicitud'}\n`;
    }).join('\n');

    const totalSection = `\n💰 TOTAL DEL PEDIDO: ${formatPrice(total)}\n\n`;
    
    const contactInfo = `📞 Información de contacto:\n• Teléfono: ${businessPhone}\n• Email: pedidos@amazonscraper.com\n\n`;
    
    const closing = `¿Podrían ayudarme con el proceso de compra y confirmar la disponibilidad de estos productos?\n\n¡Gracias por su atención!`;

    return greeting + productList + totalSection + contactInfo + closing;
  };

  const generateWhatsAppUrl = (message) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${businessPhone.replace('+', '')}?text=${encodedMessage}`;
  };

  const saveOrderToAdmin = async (orderData) => {
    try {
      // In a real app, this would save to a database
      const orderRecord = {
        id: Date.now().toString(),
        items: orderData.items,
        total: orderData.total,
        status: 'pending_whatsapp',
        createdAt: new Date().toISOString(),
        customerInfo: {
          source: 'web',
          platform: 'whatsapp_redirect'
        }
      };

      // Save to localStorage for admin dashboard (mock persistence)
      const existingOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
      existingOrders.push(orderRecord);
      localStorage.setItem('adminOrders', JSON.stringify(existingOrders));

      return orderRecord;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true);
        setError(null);

        // Generate WhatsApp message
        const message = generateWhatsAppMessage();
        setWhatsappMessage(message);

        // Generate WhatsApp URL
        const url = orderData.whatsappUrl || generateWhatsAppUrl(message);
        setWhatsappUrl(url);

        // Save order data for admin analytics
        await saveOrderToAdmin(orderData.orderSummary);

        setLoading(false);
      } catch (err) {
        console.error('Error initializing checkout:', err);
        setError('Error al preparar el pedido. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    initializeCheckout();
  }, []);

  const handleWhatsAppOpen = async () => {
    try {
      // Track the WhatsApp open event
      const orderRecord = {
        action: 'whatsapp_opened',
        timestamp: new Date().toISOString(),
        orderTotal: total,
        itemCount: items.length
      };

      // Save analytics data
      const analytics = JSON.parse(localStorage.getItem('whatsappAnalytics') || '[]');
      analytics.push(orderRecord);
      localStorage.setItem('whatsappAnalytics', JSON.stringify(analytics));

    } catch (error) {
      console.error('Error tracking WhatsApp open:', error);
    }
  };

  const handleCopyMessage = () => {
    // Track copy message event
    try {
      const copyEvent = {
        action: 'message_copied',
        timestamp: new Date().toISOString(),
        orderTotal: total
      };

      const analytics = JSON.parse(localStorage.getItem('whatsappAnalytics') || '[]');
      analytics.push(copyEvent);
      localStorage.setItem('whatsappAnalytics', JSON.stringify(analytics));
    } catch (error) {
      console.error('Error tracking copy event:', error);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Redirect to cart if no order data
  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/shopping-cart');
    }
  }, [items, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={3} className="mb-8" />

        {/* Business Greeting */}
        <BusinessGreeting className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div className="space-y-6">
            <OrderSummaryCard 
              items={items} 
              total={total}
            />
          </div>

          {/* Right Column - WhatsApp Integration */}
          <div className="space-y-6">
            <WhatsAppMessagePreview 
              message={whatsappMessage}
              onCopyMessage={handleCopyMessage}
              loading={loading}
            />

            <WhatsAppActions
              whatsappUrl={whatsappUrl}
              message={whatsappMessage}
              onWhatsAppOpen={handleWhatsAppOpen}
              onCopyMessage={handleCopyMessage}
              onRetry={handleRetry}
              loading={loading}
              error={error}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-surface rounded-lg border border-border shadow-elevation-1 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              ¿Qué sucede después?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-medium text-text-primary mb-2">Envías el mensaje</h4>
                <p className="text-sm text-text-secondary">
                  Haz clic en "Abrir WhatsApp" para enviar tu pedido
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h4 className="font-medium text-text-primary mb-2">Confirmamos disponibilidad</h4>
                <p className="text-sm text-text-secondary">
                  Verificamos stock y precios actualizados en Amazon
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-success font-bold">3</span>
                </div>
                <h4 className="font-medium text-text-primary mb-2">Procesamos tu pedido</h4>
                <p className="text-sm text-text-secondary">
                  Te ayudamos con el pago y seguimiento del envío
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCheckoutRedirect;
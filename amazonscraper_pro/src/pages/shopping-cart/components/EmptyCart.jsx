import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyCart = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/product-catalog');
  };

  const handleViewRecommendations = () => {
    navigate('/product-catalog?featured=true');
  };

  const popularCategories = [
    { id: 'electronics', name: 'Electrónicos', icon: 'Smartphone' },
    { id: 'clothing', name: 'Ropa', icon: 'Shirt' },
    { id: 'home', name: 'Hogar', icon: 'Home' },
    { id: 'sports', name: 'Deportes', icon: 'Dumbbell' }
  ];

  return (
    <div className={`min-h-[60vh] flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        {/* Empty Cart Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-secondary-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="ShoppingCart" size={48} color="var(--color-text-muted)" />
          </div>
          <div className="relative">
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center">
              <Icon name="X" size={14} color="white" />
            </div>
          </div>
        </div>

        {/* Empty State Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Tu carrito está vacío
          </h2>
          <p className="text-text-secondary mb-6">
            Parece que aún no has añadido ningún producto a tu carrito.\n¡Explora nuestro catálogo y encuentra productos increíbles!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Button
            variant="primary"
            onClick={handleContinueShopping}
            iconName="ShoppingBag"
            iconPosition="left"
            fullWidth
            className="text-base py-3"
          >
            Explorar productos
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleViewRecommendations}
            iconName="Star"
            iconPosition="left"
            fullWidth
          >
            Ver recomendados
          </Button>
        </div>

        {/* Popular Categories */}
        <div className="border-t border-border pt-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Categorías populares
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {popularCategories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => navigate(`/product-catalog?category=${category.id}`)}
                className="flex flex-col items-center space-y-2 p-4 border border-border rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-smooth"
              >
                <Icon name={category.icon} size={24} color="var(--color-primary)" />
                <span className="text-sm font-medium text-text-primary">
                  {category.name}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
            <span className="font-medium text-text-primary">¿Necesitas ayuda?</span>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            Si tienes alguna pregunta sobre nuestros productos o el proceso de compra, no dudes en contactarnos.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              const message = "¡Hola! Necesito ayuda con la compra de productos en AmazonScraper Pro. ¿Podrían asistirme?";
              const whatsappUrl = `https://wa.me/34600000000?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            iconName="MessageCircle"
            iconPosition="left"
            className="text-sm"
          >
            Contactar por WhatsApp
          </Button>
        </div>

        {/* Features Highlight */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
              <Icon name="Truck" size={20} color="var(--color-success)" />
            </div>
            <span className="text-xs text-text-secondary">Envío gratis desde 50€</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Shield" size={20} color="var(--color-primary)" />
            </div>
            <span className="text-xs text-text-secondary">Compra segura</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={20} color="var(--color-accent)" />
            </div>
            <span className="text-xs text-text-secondary">Soporte 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
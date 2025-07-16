import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductInfo = ({ product = {} }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Mock product data if none provided
  const mockProduct = {
    title: "Smartphone Samsung Galaxy A54 5G 128GB - Pantalla 6.4\" Super AMOLED",
    price: 299.99,
    originalPrice: 349.99,
    currency: 'EUR',
    rating: 4.5,
    reviewCount: 1247,
    availability: 'En stock',
    seller: 'Amazon',
    brand: 'Samsung',
    model: 'Galaxy A54 5G',
    color: 'Negro Grafito',
    storage: '128GB',
    description: `El Samsung Galaxy A54 5G combina un diseño elegante con un rendimiento excepcional. Su pantalla Super AMOLED de 6.4 pulgadas ofrece colores vibrantes y una experiencia visual inmersiva.\n\nCaracterísticas principales:\n• Procesador Exynos 1380 de alto rendimiento\n• Cámara principal de 50MP con estabilización óptica\n• Batería de 5000mAh con carga rápida de 25W\n• Resistencia al agua IP67\n• Android 13 con One UI 5.1\n\nIdeal para usuarios que buscan un smartphone completo con excelente relación calidad-precio.`,
    features: [
      'Pantalla Super AMOLED 6.4"',
      'Procesador Exynos 1380',
      'Cámara 50MP + 12MP + 5MP',
      'Batería 5000mAh',
      'Resistencia IP67',
      '5G Ready'
    ],
    badges: ['Amazon\'s Choice', 'Más vendido'],
    freeShipping: true,
    deliveryDate: '2024-01-15'
  };

  const displayProduct = Object.keys(product).length > 0 ? product : mockProduct;

  const formatPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!displayProduct.originalPrice || displayProduct.originalPrice <= displayProduct.price) return 0;
    return Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100);
  };

  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        color={i < Math.floor(rating) ? "var(--color-accent)" : "var(--color-secondary-300)"}
        className={i < Math.floor(rating) ? "fill-current" : ""}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
          {displayProduct.title}
        </h1>
      </div>

      {/* Badges */}
      {displayProduct.badges && displayProduct.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {displayProduct.badges.map((badge, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                badge === "Amazon's Choice" ? 'bg-accent text-accent-foreground' :
                badge === 'Más vendido' ? 'bg-success text-success-foreground' :
                'bg-primary text-primary-foreground'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Rating and Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {renderStars(displayProduct.rating)}
          <span className="font-data font-bold text-text-primary ml-1">
            {displayProduct.rating}
          </span>
        </div>
        <span className="text-primary hover:text-primary-700 cursor-pointer">
          ({displayProduct.reviewCount?.toLocaleString('es-ES')} valoraciones)
        </span>
      </div>

      {/* Price Section */}
      <div className="bg-surface-secondary p-4 rounded-lg border border-border">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-3xl font-data font-bold text-primary">
            {formatPrice(displayProduct.price, displayProduct.currency)}
          </span>
          {displayProduct.originalPrice && displayProduct.originalPrice > displayProduct.price && (
            <>
              <span className="text-lg font-data text-text-secondary line-through">
                {formatPrice(displayProduct.originalPrice, displayProduct.currency)}
              </span>
              <span className="bg-error text-error-foreground px-2 py-1 rounded text-sm font-bold">
                -{calculateDiscount()}%
              </span>
            </>
          )}
        </div>
        
        {/* Availability */}
        <div className="flex items-center space-x-2 mb-2">
          <Icon 
            name={displayProduct.availability === 'En stock' ? "CheckCircle" : "AlertCircle"} 
            size={16} 
            color={displayProduct.availability === 'En stock' ? "var(--color-success)" : "var(--color-warning)"} 
          />
          <span className={`font-medium ${
            displayProduct.availability === 'En stock' ? 'text-success' : 'text-warning'
          }`}>
            {displayProduct.availability}
          </span>
        </div>

        {/* Shipping Info */}
        {displayProduct.freeShipping && (
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Truck" size={16} color="var(--color-success)" />
            <span className="text-success font-medium">Envío GRATIS</span>
          </div>
        )}

        {/* Delivery Date */}
        {displayProduct.deliveryDate && (
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} color="var(--color-text-secondary)" />
            <span className="text-text-secondary">
              Recíbelo el {formatDeliveryDate(displayProduct.deliveryDate)}
            </span>
          </div>
        )}
      </div>

      {/* Product Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Especificaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayProduct.brand && (
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Marca:</span>
              <span className="font-medium text-text-primary">{displayProduct.brand}</span>
            </div>
          )}
          {displayProduct.model && (
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Modelo:</span>
              <span className="font-medium text-text-primary">{displayProduct.model}</span>
            </div>
          )}
          {displayProduct.color && (
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Color:</span>
              <span className="font-medium text-text-primary">{displayProduct.color}</span>
            </div>
          )}
          {displayProduct.storage && (
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Almacenamiento:</span>
              <span className="font-medium text-text-primary">{displayProduct.storage}</span>
            </div>
          )}
          {displayProduct.seller && (
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Vendido por:</span>
              <span className="font-medium text-text-primary">{displayProduct.seller}</span>
            </div>
          )}
        </div>
      </div>

      {/* Key Features */}
      {displayProduct.features && displayProduct.features.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Características principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {displayProduct.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="Check" size={16} color="var(--color-success)" />
                <span className="text-text-secondary">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Description */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Descripción del producto</h3>
        <div className="bg-surface-secondary p-4 rounded-lg border border-border">
          <div className={`text-text-secondary leading-relaxed ${
            !isDescriptionExpanded ? 'line-clamp-4' : ''
          }`}>
            {displayProduct.description?.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
          {displayProduct.description && displayProduct.description.length > 200 && (
            <Button
              variant="ghost"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 p-0 h-auto text-primary hover:text-primary-700"
            >
              {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
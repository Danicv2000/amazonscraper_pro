import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RelatedProducts = ({ products = [], currentProductId, className = '' }) => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  // Mock related products if none provided
  const mockProducts = [
    {
      id: '2',
      title: 'Auriculares Bluetooth Sony WH-1000XM4',
      price: 249.99,
      originalPrice: 299.99,
      currency: 'EUR',
      rating: 4.8,
      reviewCount: 892,
      image: '/assets/images/no_image.png',
      badge: 'Oferta'
    },
    {
      id: '3',
      title: 'Funda Samsung Galaxy A54 Transparente',
      price: 12.99,
      currency: 'EUR',
      rating: 4.3,
      reviewCount: 234,
      image: '/assets/images/no_image.png'
    },
    {
      id: '4',
      title: 'Cargador Rápido Samsung 25W USB-C',
      price: 19.99,
      originalPrice: 24.99,
      currency: 'EUR',
      rating: 4.6,
      reviewCount: 567,
      image: '/assets/images/no_image.png',
      badge: 'Más vendido'
    },
    {
      id: '5',
      title: 'Protector Pantalla Samsung Galaxy A54',
      price: 8.99,
      currency: 'EUR',
      rating: 4.4,
      reviewCount: 123,
      image: '/assets/images/no_image.png'
    },
    {
      id: '6',
      title: 'Power Bank 20000mAh Carga Rápida',
      price: 29.99,
      originalPrice: 39.99,
      currency: 'EUR',
      rating: 4.5,
      reviewCount: 445,
      image: '/assets/images/no_image.png',
      badge: 'Descuento'
    }
  ];

  const displayProducts = products.length > 0 
    ? products.filter(p => p.id !== currentProductId)
    : mockProducts;

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

  const handleProductClick = (productId) => {
    navigate(`/product-detail?id=${productId}`);
  };

  const handleScroll = (direction) => {
    const container = document.getElementById('related-products-scroll');
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={12}
        color={i < Math.floor(rating) ? "var(--color-accent)" : "var(--color-secondary-300)"}
        className={i < Math.floor(rating) ? "fill-current" : ""}
      />
    ));
  };

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
          Productos relacionados
        </h2>
        <Button
          variant="ghost"
          onClick={() => navigate('/product-catalog')}
          className="text-primary hover:text-primary-700"
        >
          Ver todos
        </Button>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-surface shadow-elevation-2 hover:shadow-elevation-3 transition-smooth"
          iconName="ChevronLeft"
          aria-label="Anterior"
        />
        <Button
          variant="ghost"
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-surface shadow-elevation-2 hover:shadow-elevation-3 transition-smooth"
          iconName="ChevronRight"
          aria-label="Siguiente"
        />

        {/* Products Container */}
        <div
          id="related-products-scroll"
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-12 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="flex-shrink-0 w-48 bg-surface rounded-lg border border-border hover:border-primary-200 hover:shadow-elevation-2 transition-smooth cursor-pointer group"
            >
              {/* Product Image */}
              <div className="relative aspect-square p-3">
                {product.badge && (
                  <div className="absolute top-1 left-1 z-10">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.badge === 'Más vendido' ? 'bg-success text-success-foreground' :
                      product.badge === 'Oferta' ? 'bg-accent text-accent-foreground' :
                      product.badge === 'Descuento' ? 'bg-error text-error-foreground' :
                      'bg-primary text-primary-foreground'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}
                
                <Image
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-smooth"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 pt-0">
                <h3 className="font-medium text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-smooth text-sm">
                  {product.title}
                </h3>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs text-text-secondary">
                      ({product.reviewCount})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="font-data font-bold text-primary">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="font-data text-text-secondary line-through text-xs">
                        {formatPrice(product.originalPrice, product.currency)}
                      </span>
                      <span className="bg-error text-error-foreground px-1 py-0.5 rounded text-xs font-medium">
                        -{calculateDiscount(product.originalPrice, product.price)}%
                      </span>
                    </>
                  )}
                </div>

                {/* Quick Add Button */}
                <Button
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle quick add to cart
                  }}
                  iconName="ShoppingCart"
                  iconPosition="left"
                  fullWidth
                  className="text-xs h-8"
                >
                  Añadir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Button for Mobile */}
      <div className="text-center md:hidden">
        <Button
          variant="secondary"
          onClick={() => navigate('/product-catalog')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Ver todos los productos
        </Button>
      </div>
    </div>
  );
};

export default RelatedProducts;
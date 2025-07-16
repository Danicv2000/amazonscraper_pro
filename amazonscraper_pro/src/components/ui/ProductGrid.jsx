import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null, 
  onLoadMore, 
  hasMore = true,
  onAddToCart,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loadingMore, setLoadingMore] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});

  // Mock products if none provided
  const mockProducts = [
    {
      id: '1',
      title: 'Smartphone Samsung Galaxy A54 5G 128GB',
      price: 299.99,
      originalPrice: 349.99,
      currency: 'EUR',
      rating: 4.5,
      reviewCount: 1247,
      image: '/assets/images/no_image.png',
      badge: 'Más vendido',
      inStock: true,
      freeShipping: true
    },
    {
      id: '2',
      title: 'Auriculares Bluetooth Sony WH-1000XM4',
      price: 249.99,
      originalPrice: 299.99,
      currency: 'EUR',
      rating: 4.8,
      reviewCount: 892,
      image: '/assets/images/no_image.png',
      badge: 'Oferta',
      inStock: true,
      freeShipping: true
    },
    {
      id: '3',
      title: 'Tablet iPad Air 10.9" 64GB WiFi',
      price: 599.99,
      currency: 'EUR',
      rating: 4.7,
      reviewCount: 634,
      image: '/assets/images/no_image.png',
      inStock: false,
      freeShipping: false
    },
    {
      id: '4',
      title: 'Laptop ASUS VivoBook 15.6" Intel i5',
      price: 549.99,
      originalPrice: 649.99,
      currency: 'EUR',
      rating: 4.3,
      reviewCount: 423,
      image: '/assets/images/no_image.png',
      badge: 'Descuento',
      inStock: true,
      freeShipping: true
    },
    {
      id: '5',
      title: 'Smart TV Samsung 55" 4K UHD',
      price: 449.99,
      currency: 'EUR',
      rating: 4.6,
      reviewCount: 756,
      image: '/assets/images/no_image.png',
      inStock: true,
      freeShipping: false
    },
    {
      id: '6',
      title: 'Cámara Canon EOS M50 Mark II',
      price: 699.99,
      originalPrice: 799.99,
      currency: 'EUR',
      rating: 4.9,
      reviewCount: 234,
      image: '/assets/images/no_image.png',
      badge: 'Nuevo',
      inStock: true,
      freeShipping: true
    }
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;
  const searchQuery = searchParams.get('search') || '';

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

  const handleAddToCart = async (product, event) => {
    event.stopPropagation();
    
    if (!product.inStock) return;
    
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      if (onAddToCart) {
        await onAddToCart(product);
      } else {
        // Mock add to cart delay
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !onLoadMore) return;
    
    setLoadingMore(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, onLoadMore]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore]);

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Icon name="AlertCircle" size={48} color="var(--color-error)" className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Error al cargar productos</h3>
        <p className="text-text-secondary mb-4">{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  if (loading && displayProducts.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-surface rounded-lg border border-border p-4 animate-pulse">
              <div className="aspect-square bg-secondary-200 rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                <div className="h-6 bg-secondary-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Icon name="Search" size={48} color="var(--color-text-muted)" className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {searchQuery ? 'No se encontraron productos' : 'No hay productos disponibles'}
        </h3>
        <p className="text-text-secondary mb-4">
          {searchQuery 
            ? `No encontramos productos para "${searchQuery}". Intenta con otros términos.`
            : 'Vuelve más tarde para ver nuevos productos.'
          }
        </p>
        {searchQuery && (
          <Button variant="primary" onClick={() => navigate('/product-catalog')}>
            Ver todos los productos
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Resultados para "{searchQuery}"
          </h2>
          <p className="text-text-secondary">
            {displayProducts.length} {displayProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="bg-surface rounded-lg border border-border hover:border-primary-200 hover:shadow-elevation-2 transition-smooth cursor-pointer group"
          >
            {/* Product Image */}
            <div className="relative aspect-square p-4">
              {product.badge && (
                <div className="absolute top-2 left-2 z-10">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.badge === 'Más vendido' ? 'bg-success text-success-foreground' :
                    product.badge === 'Oferta' ? 'bg-accent text-accent-foreground' :
                    product.badge === 'Nuevo' ? 'bg-primary text-primary-foreground' :
                    'bg-secondary text-secondary-foreground'
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
              
              {!product.inStock && (
                <div className="absolute inset-0 bg-surface bg-opacity-80 flex items-center justify-center">
                  <span className="bg-error text-error-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Agotado
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 pt-0">
              <h3 className="font-medium text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-smooth">
                {product.title}
              </h3>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={14}
                        color={i < Math.floor(product.rating) ? "var(--color-accent)" : "var(--color-secondary-300)"}
                        className={i < Math.floor(product.rating) ? "fill-current" : ""}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-text-secondary">
                    ({product.reviewCount?.toLocaleString('es-ES')})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="font-data font-bold text-primary text-lg">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="font-data text-text-secondary line-through text-sm">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                    <span className="bg-error text-error-foreground px-1.5 py-0.5 rounded text-xs font-medium">
                      -{calculateDiscount(product.originalPrice, product.price)}%
                    </span>
                  </>
                )}
              </div>

              {/* Shipping Info */}
              {product.freeShipping && (
                <div className="flex items-center space-x-1 mb-3">
                  <Icon name="Truck" size={14} color="var(--color-success)" />
                  <span className="text-xs text-success font-medium">Envío gratis</span>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                variant={product.inStock ? "primary" : "secondary"}
                onClick={(e) => handleAddToCart(product, e)}
                disabled={!product.inStock}
                loading={addingToCart[product.id]}
                iconName={product.inStock ? "ShoppingCart" : "AlertCircle"}
                iconPosition="left"
                fullWidth
                className="text-sm"
              >
                {product.inStock ? 'Añadir al carrito' : 'No disponible'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="text-center mt-8">
          <Button
            variant="secondary"
            onClick={handleLoadMore}
            loading={loadingMore}
            iconName="ChevronDown"
            iconPosition="right"
          >
            {loadingMore ? 'Cargando más productos...' : 'Cargar más productos'}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-surface rounded-lg border border-border p-4 animate-pulse">
              <div className="aspect-square bg-secondary-200 rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                <div className="h-6 bg-secondary-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
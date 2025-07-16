import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CustomerHeader from '../../components/ui/CustomerHeader';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import AddToCartSection from './components/AddToCartSection';
import RelatedProducts from './components/RelatedProducts';
import CustomerReviews from './components/CustomerReviews';
import Breadcrumbs from './components/Breadcrumbs';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showStickyCart, setShowStickyCart] = useState(false);

  const productId = searchParams.get('id') || '1';

  // Mock product data
  const mockProduct = {
    id: productId,
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
    maxQuantity: 5,
    images: [
      '/assets/images/no_image.png',
      '/assets/images/no_image.png',
      '/assets/images/no_image.png',
      '/assets/images/no_image.png'
    ],
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

  const breadcrumbItems = [
    { label: 'Inicio', path: '/product-catalog' },
    { label: 'Electrónicos', path: '/product-catalog?category=electronics' },
    { label: 'Smartphones', path: '/product-catalog?category=smartphones' },
    { label: mockProduct.title, path: null, current: true }
  ];

  // Mock reviews data
  const mockReviews = [
    {
      id: '1',
      author: 'María González',
      rating: 5,
      date: '2024-01-10',
      title: 'Excelente teléfono, muy recomendado',
      content: `Estoy muy satisfecha con esta compra. El teléfono funciona perfectamente, la cámara es increíble y la batería dura todo el día. La pantalla es muy nítida y los colores se ven geniales.\n\nLa entrega fue rápida y llegó en perfectas condiciones. Definitivamente lo recomiendo.`,
      verified: true,
      helpful: 23
    },
    {
      id: '2',
      author: 'Carlos Rodríguez',
      rating: 4,
      date: '2024-01-08',
      title: 'Buena relación calidad-precio',
      content: `El Samsung Galaxy A54 cumple con las expectativas. El rendimiento es bueno para el precio, aunque a veces se nota un poco lento en aplicaciones pesadas. La cámara hace fotos decentes y el diseño es elegante.`,
      verified: true,
      helpful: 15
    },
    {
      id: '3',
      author: 'Ana Martín',
      rating: 5,
      date: '2024-01-05',
      title: 'Perfecto para mi uso diario',
      content: `Lo uso principalmente para redes sociales, fotos y llamadas. Para eso es perfecto. La batería me dura fácilmente un día completo y la carga rápida es muy conveniente.`,
      verified: false,
      helpful: 8
    }
  ];

  // Mock related products
  const mockRelatedProducts = [
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
    }
  ];

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProduct(mockProduct);
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Handle sticky cart visibility
  useEffect(() => {
    const handleScroll = () => {
      const addToCartSection = document.getElementById('add-to-cart-section');
      if (addToCartSection) {
        const rect = addToCartSection.getBoundingClientRect();
        setShowStickyCart(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopping-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  const handleAddToCart = async (cartItem) => {
    try {
      const existingItemIndex = cartItems.findIndex(item => item.id === cartItem.id);
      let updatedCart;

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += cartItem.quantity;
      } else {
        // Add new item
        updatedCart = [...cartItems, cartItem];
      }

      setCartItems(updatedCart);
      localStorage.setItem('shopping-cart', JSON.stringify(updatedCart));

      // Show success feedback
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-secondary-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-secondary-200 rounded w-3/4"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                <div className="h-12 bg-secondary-200 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-secondary-200 rounded"></div>
                  <div className="h-4 bg-secondary-200 rounded w-5/6"></div>
                  <div className="h-4 bg-secondary-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} color="var(--color-error)" className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Error al cargar el producto</h2>
            <p className="text-text-secondary mb-4">{error}</p>
            <div className="space-x-4">
              <Button variant="primary" onClick={() => window.location.reload()}>
                Intentar de nuevo
              </Button>
              <Button variant="secondary" onClick={() => navigate('/product-catalog')}>
                Volver al catálogo
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Icon name="Search" size={48} color="var(--color-text-muted)" className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Producto no encontrado</h2>
            <p className="text-text-secondary mb-4">El producto que buscas no existe o ha sido eliminado.</p>
            <Button variant="primary" onClick={() => navigate('/product-catalog')}>
              Volver al catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <ProductImageGallery 
              images={product.images} 
              productName={product.title} 
            />
          </div>

          {/* Product Information */}
          <div className="lg:col-span-1">
            <ProductInfo product={product} />
            
            {/* Add to Cart Section */}
            <div id="add-to-cart-section" className="mt-8">
              <AddToCartSection 
                product={product}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts 
          products={mockRelatedProducts}
          currentProductId={product.id}
          className="mb-12"
        />

        {/* Customer Reviews */}
        <CustomerReviews 
          reviews={mockReviews}
          productRating={product.rating}
          totalReviews={product.reviewCount}
          className="mb-12"
        />
      </main>

      {/* Sticky Add to Cart Bar */}
      {showStickyCart && (
        <AddToCartSection 
          product={product}
          onAddToCart={handleAddToCart}
          isSticky={true}
          className="md:hidden"
        />
      )}
    </div>
  );
};

export default ProductDetail;
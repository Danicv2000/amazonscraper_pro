import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CustomerHeader from '../../components/ui/CustomerHeader';
import ProductGrid from '../../components/ui/ProductGrid';
import FilterPanel from '../../components/ui/FilterPanel';
import CartSummary from '../../components/ui/CartSummary';
import CategoryChips from './components/CategoryChips';
import FilterChips from './components/FilterChips';
import SortDropdown from './components/SortDropdown';
import MobileBottomNav from './components/MobileBottomNav';
import PullToRefresh from './components/PullToRefresh';
import SearchSuggestions from './components/SearchSuggestions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  
  // UI state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: '', max: '' },
    rating: '',
    inStock: false,
    freeShipping: false,
    brand: '',
    sortBy: 'relevance'
  });

  // Mock products data
  const mockProducts = [
    {
      id: '1',
      title: 'Smartphone Samsung Galaxy A54 5G 128GB Negro',
      price: 299.99,
      originalPrice: 349.99,
      currency: 'EUR',
      rating: 4.5,
      reviewCount: 1247,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      badge: 'Más vendido',
      inStock: true,
      freeShipping: true,
      category: 'electronics',
      brand: 'samsung'
    },
    {
      id: '2',
      title: 'Auriculares Bluetooth Sony WH-1000XM4 Cancelación Ruido',
      price: 249.99,
      originalPrice: 299.99,
      currency: 'EUR',
      rating: 4.8,
      reviewCount: 892,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      badge: 'Oferta',
      inStock: true,
      freeShipping: true,
      category: 'electronics',
      brand: 'sony'
    },
    {
      id: '3',
      title: 'Tablet iPad Air 10.9" 64GB WiFi Azul Cielo',
      price: 599.99,
      currency: 'EUR',
      rating: 4.7,
      reviewCount: 634,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      inStock: false,
      freeShipping: false,
      category: 'electronics',
      brand: 'apple'
    },
    {
      id: '4',
      title: 'Laptop ASUS VivoBook 15.6" Intel i5 8GB RAM 512GB SSD',
      price: 549.99,
      originalPrice: 649.99,
      currency: 'EUR',
      rating: 4.3,
      reviewCount: 423,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      badge: 'Descuento',
      inStock: true,
      freeShipping: true,
      category: 'electronics',
      brand: 'asus'
    },
    {
      id: '5',
      title: 'Smart TV Samsung 55" 4K UHD Crystal Display',
      price: 449.99,
      currency: 'EUR',
      rating: 4.6,
      reviewCount: 756,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
      inStock: true,
      freeShipping: false,
      category: 'electronics',
      brand: 'samsung'
    },
    {
      id: '6',
      title: 'Cámara Canon EOS M50 Mark II Mirrorless 24.1MP',
      price: 699.99,
      originalPrice: 799.99,
      currency: 'EUR',
      rating: 4.9,
      reviewCount: 234,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
      badge: 'Nuevo',
      inStock: true,
      freeShipping: true,
      category: 'electronics',
      brand: 'canon'
    },
    {
      id: '7',
      title: 'Zapatillas Nike Air Max 270 Hombre Negro/Blanco',
      price: 129.99,
      originalPrice: 149.99,
      currency: 'EUR',
      rating: 4.4,
      reviewCount: 567,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      inStock: true,
      freeShipping: true,
      category: 'clothing',
      brand: 'nike'
    },
    {
      id: '8',
      title: 'Libro "El Quijote" Edición Especial Tapa Dura',
      price: 24.99,
      currency: 'EUR',
      rating: 4.8,
      reviewCount: 189,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      inStock: true,
      freeShipping: false,
      category: 'books',
      brand: 'cervantes'
    }
  ];

  // Initialize from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlSort = searchParams.get('sort') || 'relevance';
    
    setSearchQuery(urlQuery);
    setFilters(prev => ({
      ...prev,
      category: urlCategory,
      sortBy: urlSort,
      priceRange: {
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || ''
      },
      rating: searchParams.get('rating') || '',
      inStock: searchParams.get('inStock') === 'true',
      freeShipping: searchParams.get('freeShipping') === 'true',
      brand: searchParams.get('brand') || ''
    }));
  }, [searchParams]);

  // Load products based on filters
  const loadProducts = useCallback(async (isRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredProducts = [...mockProducts];
      
      // Apply search filter
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (filters.category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category === filters.category
        );
      }
      
      // Apply brand filter
      if (filters.brand) {
        filteredProducts = filteredProducts.filter(product =>
          product.brand === filters.brand
        );
      }
      
      // Apply price range filter
      if (filters.priceRange.min || filters.priceRange.max) {
        filteredProducts = filteredProducts.filter(product => {
          const price = product.price;
          const min = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0;
          const max = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity;
          return price >= min && price <= max;
        });
      }
      
      // Apply rating filter
      if (filters.rating) {
        const minRating = parseFloat(filters.rating);
        filteredProducts = filteredProducts.filter(product =>
          product.rating >= minRating
        );
      }
      
      // Apply stock filter
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
      }
      
      // Apply free shipping filter
      if (filters.freeShipping) {
        filteredProducts = filteredProducts.filter(product => product.freeShipping);
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.reverse();
          break;
        default:
          // Keep original order for relevance
          break;
      }
      
      setProducts(filteredProducts);
      setHasMore(false); // For demo purposes
      
    } catch (err) {
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Event handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
    setShowSearchSuggestions(false);
  };

  const handleCategorySelect = (category) => {
    setFilters(prev => ({ ...prev, category }));
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortBy);
    setSearchParams(newParams);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleRemoveFilter = (filterType) => {
    const newFilters = { ...filters };
    const newParams = new URLSearchParams(searchParams);
    
    switch (filterType) {
      case 'priceRange':
        newFilters.priceRange = { min: '', max: '' };
        newParams.delete('minPrice');
        newParams.delete('maxPrice');
        break;
      case 'category':
        newFilters.category = '';
        newParams.delete('category');
        break;
      case 'brand':
        newFilters.brand = '';
        newParams.delete('brand');
        break;
      case 'rating':
        newFilters.rating = '';
        newParams.delete('rating');
        break;
      case 'inStock':
        newFilters.inStock = false;
        newParams.delete('inStock');
        break;
      case 'freeShipping':
        newFilters.freeShipping = false;
        newParams.delete('freeShipping');
        break;
      default:
        break;
    }
    
    setFilters(newFilters);
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: { min: '', max: '' },
      rating: '',
      inStock: false,
      freeShipping: false,
      brand: '',
      sortBy: 'relevance'
    };
    setFilters(clearedFilters);
    
    const newParams = new URLSearchParams();
    const searchQuery = searchParams.get('search');
    if (searchQuery) newParams.set('search', searchQuery);
    setSearchParams(newParams);
  };

  const handleAddToCart = async (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(prev => 
        prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleRefresh = async () => {
    await loadProducts(true);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <CustomerHeader />
      
      {/* Mobile Search Bar */}
      <div className="md:hidden bg-surface border-b border-border px-4 py-3">
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar productos de Amazon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchSuggestions(true)}
            className="w-full pl-10 pr-4 py-2"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={18} color="var(--color-text-secondary)" />
          </div>
          <Button
            variant="ghost"
            onClick={() => handleSearch(searchQuery)}
            iconName="Search"
            className="absolute inset-y-0 right-0 px-3"
            aria-label="Buscar"
          />
          
          {/* Search Suggestions */}
          <SearchSuggestions
            query={searchQuery}
            isVisible={showSearchSuggestions}
            onSuggestionClick={handleSearch}
            onClose={() => setShowSearchSuggestions(false)}
          />
        </div>
      </div>

      {/* Category Chips */}
      <CategoryChips
        selectedCategory={filters.category}
        onCategorySelect={handleCategorySelect}
      />

      {/* Filter Chips */}
      <FilterChips
        activeFilters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block">
          <FilterPanel
            isOpen={true}
            onApplyFilters={handleApplyFilters}
            className="sticky top-20"
          />
        </div>

        {/* Product Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsFilterOpen(true)}
                  iconName="Filter"
                  iconPosition="left"
                  className="lg:hidden"
                >
                  Filtros
                </Button>
                
                <div className="text-sm text-text-secondary">
                  {loading ? 'Cargando...' : `${products.length} productos encontrados`}
                </div>
              </div>
              
              <SortDropdown
                selectedSort={filters.sortBy}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Products Grid with Pull to Refresh */}
            <PullToRefresh onRefresh={handleRefresh}>
              <ProductGrid
                products={products}
                loading={loading}
                error={error}
                hasMore={hasMore}
                onAddToCart={handleAddToCart}
                className="pb-20 md:pb-6"
              />
            </PullToRefresh>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        isMobile={true}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onFilterToggle={() => setIsFilterOpen(true)}
        cartCount={cartCount}
      />

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <CartSummary
          items={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemove={handleRemoveFromCart}
          className="mb-16 md:mb-0"
        />
      )}
    </div>
  );
};

export default ProductCatalog;
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const FilterPanel = ({ 
  isOpen = false, 
  onClose, 
  onApplyFilters, 
  className = '',
  isMobile = false 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    category: '',
    rating: '',
    inStock: false,
    freeShipping: false,
    brand: '',
    sortBy: 'relevance'
  });
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    rating: true,
    features: true,
    brand: false
  });

  // Mock filter options
  const filterOptions = {
    categories: [
      { id: 'electronics', name: 'Electrónicos', count: 1247 },
      { id: 'clothing', name: 'Ropa y Accesorios', count: 892 },
      { id: 'home', name: 'Hogar y Jardín', count: 634 },
      { id: 'sports', name: 'Deportes', count: 423 },
      { id: 'books', name: 'Libros', count: 756 },
      { id: 'beauty', name: 'Belleza y Cuidado', count: 234 }
    ],
    brands: [
      { id: 'samsung', name: 'Samsung', count: 156 },
      { id: 'apple', name: 'Apple', count: 134 },
      { id: 'sony', name: 'Sony', count: 98 },
      { id: 'lg', name: 'LG', count: 87 },
      { id: 'nike', name: 'Nike', count: 76 },
      { id: 'adidas', name: 'Adidas', count: 65 }
    ],
    sortOptions: [
      { id: 'relevance', name: 'Relevancia' },
      { id: 'price-low', name: 'Precio: menor a mayor' },
      { id: 'price-high', name: 'Precio: mayor a menor' },
      { id: 'rating', name: 'Mejor valorados' },
      { id: 'newest', name: 'Más recientes' }
    ]
  };

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      priceRange: {
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || ''
      },
      category: searchParams.get('category') || '',
      rating: searchParams.get('rating') || '',
      inStock: searchParams.get('inStock') === 'true',
      freeShipping: searchParams.get('freeShipping') === 'true',
      brand: searchParams.get('brand') || '',
      sortBy: searchParams.get('sort') || 'relevance'
    };
    setFilters(urlFilters);
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    // Update URL params
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'priceRange') {
        if (value.min) newParams.set('minPrice', value.min);
        else newParams.delete('minPrice');
        if (value.max) newParams.set('maxPrice', value.max);
        else newParams.delete('maxPrice');
      } else if (typeof value === 'boolean') {
        if (value) newParams.set(key, 'true');
        else newParams.delete(key);
      } else if (value) {
        if (key === 'sortBy') newParams.set('sort', value);
        else newParams.set(key, value);
      } else {
        if (key === 'sortBy') newParams.delete('sort');
        else newParams.delete(key);
      }
    });

    setSearchParams(newParams);
    
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    
    if (isMobile && onClose) {
      onClose();
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceRange: { min: '', max: '' },
      category: '',
      rating: '',
      inStock: false,
      freeShipping: false,
      brand: '',
      sortBy: 'relevance'
    };
    setFilters(clearedFilters);
    
    // Clear URL params except search
    const newParams = new URLSearchParams();
    const searchQuery = searchParams.get('search');
    if (searchQuery) newParams.set('search', searchQuery);
    setSearchParams(newParams);
    
    if (onApplyFilters) {
      onApplyFilters(clearedFilters);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.category) count++;
    if (filters.rating) count++;
    if (filters.inStock) count++;
    if (filters.freeShipping) count++;
    if (filters.brand) count++;
    return count;
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-0 text-left hover:text-primary transition-smooth"
      >
        <span className="font-medium text-text-primary">{title}</span>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          color="var(--color-text-secondary)" 
        />
      </button>
      {isExpanded && (
        <div className="pb-4 animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );

  const panelContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-text-primary">Filtros</h2>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            onClick={onClose}
            iconName="X"
            className="p-2"
            aria-label="Cerrar filtros"
          />
        )}
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-0">
          {/* Sort By */}
          <FilterSection
            title="Ordenar por"
            isExpanded={expandedSections.sort}
            onToggle={() => toggleSection('sort')}
          >
            <div className="space-y-2">
              {filterOptions.sortOptions.map((option) => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.id}
                    checked={filters.sortBy === option.id}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="text-primary focus:ring-primary-200"
                  />
                  <span className="text-sm text-text-secondary">{option.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection
            title="Rango de precio"
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Mín €"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Máx €"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex space-x-2 text-xs">
                <Button
                  variant="ghost"
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: { min: '0', max: '50' } }))}
                  className="text-xs px-2 py-1"
                >
                  0-50€
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: { min: '50', max: '200' } }))}
                  className="text-xs px-2 py-1"
                >
                  50-200€
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: { min: '200', max: '' } }))}
                  className="text-xs px-2 py-1"
                >
                  200€+
                </Button>
              </div>
            </div>
          </FilterSection>

          {/* Category */}
          <FilterSection
            title="Categoría"
            isExpanded={expandedSections.category}
            onToggle={() => toggleSection('category')}
          >
            <div className="space-y-2">
              {filterOptions.categories.map((category) => (
                <label key={category.id} className="flex items-center justify-between cursor-pointer hover:bg-secondary-50 -mx-2 px-2 py-1 rounded">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={filters.category === category.id}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="text-primary focus:ring-primary-200"
                    />
                    <span className="text-sm text-text-secondary">{category.name}</span>
                  </div>
                  <span className="text-xs text-text-muted font-data">({category.count})</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection
            title="Valoración"
            isExpanded={expandedSections.rating}
            onToggle={() => toggleSection('rating')}
          >
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating.toString()}
                    checked={filters.rating === rating.toString()}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="text-primary focus:ring-primary-200"
                  />
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={14}
                        color={i < rating ? "var(--color-accent)" : "var(--color-secondary-300)"}
                        className={i < rating ? "fill-current" : ""}
                      />
                    ))}
                    <span className="text-sm text-text-secondary ml-1">y más</span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Features */}
          <FilterSection
            title="Características"
            isExpanded={expandedSections.features}
            onToggle={() => toggleSection('features')}
          >
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="text-primary focus:ring-primary-200"
                />
                <span className="text-sm text-text-secondary">Solo productos en stock</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.freeShipping}
                  onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
                  className="text-primary focus:ring-primary-200"
                />
                <span className="text-sm text-text-secondary">Envío gratis</span>
              </label>
            </div>
          </FilterSection>

          {/* Brand */}
          <FilterSection
            title="Marca"
            isExpanded={expandedSections.brand}
            onToggle={() => toggleSection('brand')}
          >
            <div className="space-y-2">
              {filterOptions.brands.map((brand) => (
                <label key={brand.id} className="flex items-center justify-between cursor-pointer hover:bg-secondary-50 -mx-2 px-2 py-1 rounded">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="brand"
                      value={brand.id}
                      checked={filters.brand === brand.id}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="text-primary focus:ring-primary-200"
                    />
                    <span className="text-sm text-text-secondary">{brand.name}</span>
                  </div>
                  <span className="text-xs text-text-muted font-data">({brand.count})</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={clearFilters}
            iconName="RotateCcw"
            iconPosition="left"
            className="flex-1"
          >
            Limpiar
          </Button>
          <Button
            variant="primary"
            onClick={applyFilters}
            iconName="Filter"
            iconPosition="left"
            className="flex-1"
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-300 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div className={`absolute inset-y-0 left-0 w-full max-w-sm bg-surface shadow-elevation-4 ${className}`}>
              {panelContent}
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className={`w-80 bg-surface border-r border-border ${className}`}>
      {panelContent}
    </div>
  );
};

export default FilterPanel;
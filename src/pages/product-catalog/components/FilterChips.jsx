import React from 'react';

import Button from '../../../components/ui/Button';

const FilterChips = ({ 
  activeFilters = {}, 
  onRemoveFilter, 
  onClearAll,
  className = '' 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getFilterChips = () => {
    const chips = [];

    // Price range chip
    if (activeFilters.priceRange?.min || activeFilters.priceRange?.max) {
      const min = activeFilters.priceRange.min || '0';
      const max = activeFilters.priceRange.max || '∞';
      chips.push({
        id: 'priceRange',
        label: `${formatPrice(min)} - ${max === '∞' ? max : formatPrice(max)}`,
        type: 'priceRange'
      });
    }

    // Category chip
    if (activeFilters.category) {
      const categoryNames = {
        'electronics': 'Electrónicos',
        'clothing': 'Ropa',
        'home': 'Hogar',
        'sports': 'Deportes',
        'books': 'Libros',
        'beauty': 'Belleza'
      };
      chips.push({
        id: 'category',
        label: categoryNames[activeFilters.category] || activeFilters.category,
        type: 'category'
      });
    }

    // Brand chip
    if (activeFilters.brand) {
      const brandNames = {
        'samsung': 'Samsung',
        'apple': 'Apple',
        'sony': 'Sony',
        'lg': 'LG',
        'nike': 'Nike',
        'adidas': 'Adidas'
      };
      chips.push({
        id: 'brand',
        label: brandNames[activeFilters.brand] || activeFilters.brand,
        type: 'brand'
      });
    }

    // Rating chip
    if (activeFilters.rating) {
      chips.push({
        id: 'rating',
        label: `${activeFilters.rating}+ estrellas`,
        type: 'rating'
      });
    }

    // In stock chip
    if (activeFilters.inStock) {
      chips.push({
        id: 'inStock',
        label: 'En stock',
        type: 'inStock'
      });
    }

    // Free shipping chip
    if (activeFilters.freeShipping) {
      chips.push({
        id: 'freeShipping',
        label: 'Envío gratis',
        type: 'freeShipping'
      });
    }

    return chips;
  };

  const filterChips = getFilterChips();

  if (filterChips.length === 0) {
    return null;
  }

  const handleRemoveFilter = (filterType) => {
    if (onRemoveFilter) {
      onRemoveFilter(filterType);
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  return (
    <div className={`bg-background border-b border-border ${className}`}>
      <div className="px-4 py-3">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          <span className="text-sm text-text-secondary font-medium flex-shrink-0">
            Filtros activos:
          </span>
          
          {filterChips.map((chip) => (
            <div
              key={chip.id}
              className="flex items-center space-x-1 bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-smooth hover:bg-primary-200"
            >
              <span>{chip.label}</span>
              <Button
                variant="ghost"
                onClick={() => handleRemoveFilter(chip.type)}
                iconName="X"
                className="p-0 w-4 h-4 text-primary-600 hover:text-primary-800 hover:bg-primary-200 rounded-full"
                aria-label={`Eliminar filtro ${chip.label}`}
              />
            </div>
          ))}

          {filterChips.length > 1 && (
            <Button
              variant="ghost"
              onClick={handleClearAll}
              iconName="RotateCcw"
              iconPosition="left"
              className="flex-shrink-0 text-sm text-text-secondary hover:text-text-primary px-3 py-1.5"
            >
              Limpiar todo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterChips;
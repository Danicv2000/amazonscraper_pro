import React from 'react';

import Button from '../../../components/ui/Button';

const CategoryChips = ({ 
  categories = [], 
  selectedCategory = '', 
  onCategorySelect,
  className = '' 
}) => {
  const mockCategories = [
    { id: 'all', name: 'Todos', icon: 'Grid3X3' },
    { id: 'electronics', name: 'Electrónicos', icon: 'Smartphone' },
    { id: 'clothing', name: 'Ropa', icon: 'Shirt' },
    { id: 'home', name: 'Hogar', icon: 'Home' },
    { id: 'sports', name: 'Deportes', icon: 'Dumbbell' },
    { id: 'books', name: 'Libros', icon: 'Book' },
    { id: 'beauty', name: 'Belleza', icon: 'Sparkles' }
  ];

  const displayCategories = categories.length > 0 ? categories : mockCategories;

  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId === 'all' ? '' : categoryId);
    }
  };

  return (
    <div className={`bg-surface border-b border-border ${className}`}>
      <div className="px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {displayCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id || (selectedCategory === '' && category.id === 'all') ? 'primary' : 'ghost'}
              onClick={() => handleCategoryClick(category.id)}
              iconName={category.icon}
              iconPosition="left"
              className={`flex-shrink-0 whitespace-nowrap transition-smooth ${
                selectedCategory === category.id || (selectedCategory === '' && category.id === 'all')
                  ? 'bg-primary text-primary-foreground shadow-elevation-2' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryChips;
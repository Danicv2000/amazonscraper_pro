import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortDropdown = ({ 
  selectedSort = 'relevance', 
  onSortChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { id: 'relevance', name: 'Relevancia', icon: 'Target' },
    { id: 'price-low', name: 'Precio: menor a mayor', icon: 'ArrowUp' },
    { id: 'price-high', name: 'Precio: mayor a menor', icon: 'ArrowDown' },
    { id: 'rating', name: 'Mejor valorados', icon: 'Star' },
    { id: 'newest', name: 'Más recientes', icon: 'Clock' }
  ];

  const selectedOption = sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (sortId) => {
    if (onSortChange) {
      onSortChange(sortId);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        iconName={selectedOption.icon}
        iconPosition="left"
        className="flex items-center space-x-2 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 border border-border rounded-lg"
      >
        <span className="hidden sm:inline">{selectedOption.name}</span>
        <span className="sm:hidden">Ordenar</span>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          color="var(--color-text-secondary)" 
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-elevation-3 border border-border z-200 animate-slide-down">
          <div className="py-2">
            {sortOptions.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                onClick={() => handleSortSelect(option.id)}
                iconName={option.icon}
                iconPosition="left"
                className={`w-full justify-start px-4 py-2 text-left transition-smooth ${
                  selectedSort === option.id
                    ? 'bg-primary-50 text-primary font-medium' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                }`}
              >
                {option.name}
                {selectedSort === option.id && (
                  <Icon 
                    name="Check" 
                    size={16} 
                    color="var(--color-primary)" 
                    className="ml-auto" 
                  />
                )}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
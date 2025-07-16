import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchSuggestions = ({ 
  query = '', 
  isVisible = false, 
  onSuggestionClick, 
  onClose,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  // Mock suggestions based on query
  const mockSuggestions = [
    'smartphone samsung galaxy',
    'auriculares bluetooth',
    'tablet ipad',
    'laptop gaming',
    'smart tv 55 pulgadas',
    'cámara digital',
    'smartwatch',
    'altavoz bluetooth',
    'teclado mecánico',
    'mouse gaming'
  ];

  // Mock recent searches
  const mockRecentSearches = [
    'iPhone 14',
    'PlayStation 5',
    'MacBook Air',
    'AirPods Pro'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        setRecentSearches(mockRecentSearches);
      }
    } else {
      setRecentSearches(mockRecentSearches);
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      // Filter suggestions based on query
      const filtered = mockSuggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSuggestionClick = (suggestion) => {
    // Save to recent searches
    const updatedRecent = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      navigate(`/product-catalog?search=${encodeURIComponent(suggestion)}`);
    }
  };

  const handleRecentSearchClick = (search) => {
    handleSuggestionClick(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-150"
        onClick={onClose}
      />
      
      {/* Suggestions Panel */}
      <div className={`absolute top-full left-0 right-0 bg-surface border border-border rounded-b-lg shadow-elevation-3 z-200 max-h-96 overflow-y-auto animate-slide-down ${className}`}>
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="p-2">
            <div className="flex items-center space-x-2 px-3 py-2">
              <Icon name="Search" size={16} color="var(--color-text-muted)" />
              <span className="text-sm font-medium text-text-secondary">Sugerencias</span>
            </div>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full justify-start px-3 py-2 text-left hover:bg-secondary-50 transition-smooth"
              >
                <Icon name="Search" size={16} color="var(--color-text-muted)" className="mr-3" />
                <span className="text-text-primary">{suggestion}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Recent Searches */}
        {query.length === 0 && recentSearches.length > 0 && (
          <div className="p-2 border-t border-border">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} color="var(--color-text-muted)" />
                <span className="text-sm font-medium text-text-secondary">Búsquedas recientes</span>
              </div>
              <Button
                variant="ghost"
                onClick={clearRecentSearches}
                className="text-xs text-text-muted hover:text-text-secondary px-2 py-1"
              >
                Limpiar
              </Button>
            </div>
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleRecentSearchClick(search)}
                className="w-full justify-start px-3 py-2 text-left hover:bg-secondary-50 transition-smooth"
              >
                <Icon name="Clock" size={16} color="var(--color-text-muted)" className="mr-3" />
                <span className="text-text-primary">{search}</span>
                <Icon name="ArrowUpLeft" size={14} color="var(--color-text-muted)" className="ml-auto" />
              </Button>
            ))}
          </div>
        )}

        {/* No Results */}
        {query.length > 0 && suggestions.length === 0 && (
          <div className="p-6 text-center">
            <Icon name="Search" size={32} color="var(--color-text-muted)" className="mx-auto mb-2" />
            <p className="text-text-secondary">No se encontraron sugerencias para "{query}"</p>
          </div>
        )}

        {/* Popular Categories */}
        {query.length === 0 && recentSearches.length === 0 && (
          <div className="p-2">
            <div className="flex items-center space-x-2 px-3 py-2">
              <Icon name="TrendingUp" size={16} color="var(--color-text-muted)" />
              <span className="text-sm font-medium text-text-secondary">Categorías populares</span>
            </div>
            {['Electrónicos', 'Ropa y Moda', 'Hogar y Jardín', 'Deportes'].map((category, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleSuggestionClick(category)}
                className="w-full justify-start px-3 py-2 text-left hover:bg-secondary-50 transition-smooth"
              >
                <Icon name="Tag" size={16} color="var(--color-text-muted)" className="mr-3" />
                <span className="text-text-primary">{category}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchSuggestions;
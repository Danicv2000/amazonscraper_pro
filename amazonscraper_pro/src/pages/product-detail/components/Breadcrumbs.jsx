import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Breadcrumbs = ({ items = [], className = '' }) => {
  const navigate = useNavigate();

  // Mock breadcrumb items if none provided
  const mockItems = [
    { label: 'Inicio', path: '/product-catalog' },
    { label: 'Electrónicos', path: '/product-catalog?category=electronics' },
    { label: 'Smartphones', path: '/product-catalog?category=smartphones' },
    { label: 'Samsung Galaxy A54 5G', path: null, current: true }
  ];

  const displayItems = items.length > 0 ? items : mockItems;

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  if (displayItems.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                color="var(--color-text-muted)" 
                className="mx-1"
              />
            )}
            
            {item.current ? (
              <span className="text-text-primary font-medium truncate max-w-xs">
                {item.label}
              </span>
            ) : (
              <Button
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className="text-text-secondary hover:text-primary p-0 h-auto font-normal underline-offset-2 hover:underline"
              >
                {item.label}
              </Button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
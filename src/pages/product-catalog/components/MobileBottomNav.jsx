import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MobileBottomNav = ({ 
  onFilterToggle, 
  cartCount = 0,
  className = '' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'catalog',
      label: 'Catálogo',
      icon: 'Grid3X3',
      path: '/product-catalog',
      action: () => navigate('/product-catalog')
    },
    {
      id: 'filter',
      label: 'Filtros',
      icon: 'Filter',
      action: onFilterToggle
    },
    {
      id: 'cart',
      label: 'Carrito',
      icon: 'ShoppingCart',
      path: '/shopping-cart',
      badge: cartCount,
      action: () => navigate('/shopping-cart')
    }
  ];

  const isActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    return false;
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-elevation-3 z-100 md:hidden ${className}`}>
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={item.action}
            className={`flex flex-col items-center space-y-1 p-3 min-w-0 flex-1 transition-smooth ${
              isActive(item)
                ? 'text-primary' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            <div className="relative">
              <Icon 
                name={item.icon} 
                size={20} 
                color={isActive(item) ? "var(--color-primary)" : "var(--color-text-secondary)"} 
              />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] transition-spring">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium truncate">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
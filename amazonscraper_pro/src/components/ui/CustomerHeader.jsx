import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Input from './Input';
import Button from './Button';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Mock cart count - in real app this would come from CartContext
  const cartCount = 3;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product-catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleCartClick = () => {
    navigate('/shopping-cart');
  };

  const handleLogoClick = () => {
    navigate('/product-catalog');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const isProductDetail = location.pathname === '/product-detail';
  const isCart = location.pathname === '/shopping-cart';
  const isCheckout = location.pathname === '/whats-app-checkout-redirect';

  return (
    <header className="sticky top-0 z-100 bg-surface border-b border-border shadow-elevation-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {(isProductDetail || isCart || isCheckout) ? (
              <Button
                variant="ghost"
                onClick={handleBackClick}
                iconName="ArrowLeft"
                className="p-2 -ml-2"
                aria-label="Volver"
              />
            ) : null}
            
            {/* Logo */}
            <div 
              onClick={handleLogoClick}
              className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="ShoppingBag" size={20} color="white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-heading font-bold text-primary">
                    AmazonScraper
                  </h1>
                  <p className="text-xs text-text-secondary font-medium -mt-1">
                    Pro
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Buscar productos de Amazon..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Search" size={18} color="var(--color-text-secondary)" />
              </div>
              {searchQuery && (
                <Button
                  type="submit"
                  variant="primary"
                  className="absolute inset-y-0 right-0 px-4 rounded-l-none"
                  iconName="Search"
                  aria-label="Buscar"
                />
              )}
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              iconName="Search"
              className="md:hidden p-2"
              aria-label="Buscar"
            />

            {/* Cart Button */}
            <Button
              variant="ghost"
              onClick={handleCartClick}
              className="relative p-2"
              aria-label={`Carrito (${cartCount} productos)`}
            >
              <Icon name="ShoppingCart" size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] transition-spring">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Buscar productos de Amazon..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-16 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Search" size={18} color="var(--color-text-secondary)" />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="absolute inset-y-0 right-0 px-4 rounded-l-none"
                iconName="Search"
                aria-label="Buscar"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default CustomerHeader;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AdminNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user profile - in real app this would come from AuthContext
  const userProfile = {
    name: 'Administrador',
    email: 'admin@amazonscraper.com',
    avatar: null
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/admin-dashboard',
      icon: 'BarChart3',
      description: 'Panel principal'
    },
    {
      label: 'Pedidos',
      path: '/admin/orders',
      icon: 'Package',
      description: 'Gestión de pedidos'
    },
    {
      label: 'Productos',
      path: '/admin/products',
      icon: 'ShoppingBag',
      description: 'Catálogo de productos'
    },
    {
      label: 'Análisis',
      path: '/admin/analytics',
      icon: 'TrendingUp',
      description: 'Métricas y reportes'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // In real app, this would clear auth state and redirect
    navigate('/admin-login');
    setIsProfileOpen(false);
  };

  const isActiveTab = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="bg-surface border-b border-border shadow-elevation-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <div 
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="BarChart3" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-xl font-heading font-bold text-primary">
                    AmazonScraper Pro
                  </h1>
                  <p className="text-xs text-text-secondary font-medium -mt-1">
                    Panel de Administración
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden lg:flex space-x-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActiveTab(item.path) ? 'primary' : 'ghost'}
                  onClick={() => handleNavigation(item.path)}
                  iconName={item.icon}
                  iconPosition="left"
                  className={`px-4 py-2 transition-smooth ${
                    isActiveTab(item.path) 
                      ? 'bg-primary text-primary-foreground shadow-elevation-2' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              className="relative p-2 text-text-secondary hover:text-text-primary"
              aria-label="Notificaciones"
            >
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 text-text-secondary hover:text-text-primary"
              >
                <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} />
                </div>
                <span className="hidden md:block font-medium">{userProfile.name}</span>
                <Icon name="ChevronDown" size={16} />
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-elevation-3 border border-border z-200 animate-slide-down">
                  <div className="p-4 border-b border-border">
                    <p className="font-medium text-text-primary">{userProfile.name}</p>
                    <p className="text-sm text-text-secondary">{userProfile.email}</p>
                  </div>
                  <div className="py-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/admin/profile');
                      }}
                      iconName="Settings"
                      iconPosition="left"
                      className="w-full justify-start px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50"
                    >
                      Configuración
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      iconName="LogOut"
                      iconPosition="left"
                      className="w-full justify-start px-4 py-2 text-error hover:text-error-700 hover:bg-error-50"
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              aria-label="Menú"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-surface animate-slide-down">
            <div className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActiveTab(item.path) ? 'primary' : 'ghost'}
                  onClick={() => handleNavigation(item.path)}
                  iconName={item.icon}
                  iconPosition="left"
                  className={`w-full justify-start px-4 py-3 transition-smooth ${
                    isActiveTab(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs opacity-75">{item.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-150" 
          onClick={() => {
            setIsProfileOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default AdminNavigation;
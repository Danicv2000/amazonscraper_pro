import React, { useEffect } from 'react';
import { useAuth, useSessionTimeout } from '../../components/ui/AuthGuard';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import LoginBackground from './components/LoginBackground';

const AdminLogin = () => {
  const { isAuthenticated } = useAuth();
  
  // Session timeout hook for security
  useSessionTimeout();

  // Set page title
  useEffect(() => {
    document.title = 'Iniciar Sesión - AmazonScraper Pro';
  }, []);

  // Prevent authenticated users from seeing login page
  if (isAuthenticated) {
    return null; // AuthGuard will handle redirect
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      {/* Background Elements */}
      <LoginBackground />
      
      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-surface shadow-elevation-4 rounded-2xl border border-border p-8">
          {/* Header Section */}
          <LoginHeader />
          
          {/* Login Form */}
          <LoginForm />
          
          {/* Footer Section */}
          <LoginFooter />
        </div>
      </div>

      {/* Mobile Optimization Notice */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden">
        <div className="bg-primary text-primary-foreground rounded-lg p-3 text-center text-xs">
          Para una mejor experiencia, recomendamos usar un dispositivo de escritorio
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
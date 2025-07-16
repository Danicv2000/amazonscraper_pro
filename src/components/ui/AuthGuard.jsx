import React, { useState, useEffect, createContext, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Auth Context
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Environment-based credentials (in real app, these would be in .env)
  const ADMIN_CREDENTIALS = {
    username: process.env.REACT_APP_ADMIN_USERNAME || 'admin',
    password: process.env.REACT_APP_ADMIN_PASSWORD || 'admin123',
    email: process.env.REACT_APP_ADMIN_EMAIL || 'admin@amazonscraper.com'
  };

  useEffect(() => {
    // Check for existing session on app load
    const checkAuthStatus = () => {
      try {
        const savedAuth = localStorage.getItem('adminAuth');
        const sessionExpiry = localStorage.getItem('adminAuthExpiry');
        
        if (savedAuth && sessionExpiry) {
          const now = new Date().getTime();
          const expiry = parseInt(sessionExpiry);
          
          if (now < expiry) {
            const authData = JSON.parse(savedAuth);
            setIsAuthenticated(true);
            setUser(authData.user);
          } else {
            // Session expired
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('adminAuthExpiry');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthExpiry');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const { username, password } = credentials;
      
      // Validate against environment credentials
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const userData = {
          id: '1',
          username: ADMIN_CREDENTIALS.username,
          email: ADMIN_CREDENTIALS.email,
          name: 'Administrador',
          role: 'admin',
          loginTime: new Date().toISOString()
        };

        // Set session expiry (24 hours)
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        
        // Save to localStorage
        localStorage.setItem('adminAuth', JSON.stringify({ user: userData }));
        localStorage.setItem('adminAuthExpiry', expiryTime.toString());
        
        setIsAuthenticated(true);
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Error durante el inicio de sesión' 
      };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminAuthExpiry');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth Guard Component
const AuthGuard = ({ children, requireAuth = true, redirectTo = '/admin-login' }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirect logic
  if (requireAuth && !isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // If user is authenticated and trying to access login page, redirect to dashboard
    const from = location.state?.from?.pathname || '/admin-dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

// Protected Route wrapper for admin routes
export const ProtectedAdminRoute = ({ children }) => {
  return (
    <AuthGuard requireAuth={true} redirectTo="/admin-login">
      {children}
    </AuthGuard>
  );
};

// Public Route wrapper (redirects authenticated users away from login)
export const PublicRoute = ({ children }) => {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  );
};

// Session timeout handler
export const useSessionTimeout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    let timeoutId;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      // Auto logout after 30 minutes of inactivity
      timeoutId = setTimeout(() => {
        logout();
        alert('Sesión expirada por inactividad. Por favor, inicia sesión nuevamente.');
      }, 30 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Reset timeout on user activity
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    // Initial timeout
    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [logout]);
};

export default AuthGuard;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../components/ui/AuthGuard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login({
        username: formData.username,
        password: formData.password
      });
      
      if (result.success) {
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || '/admin-dashboard';
        navigate(from, { replace: true });
      } else {
        setLoginAttempts(prev => prev + 1);
        setErrors({
          general: result.error || 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.'
        });
      }
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      setErrors({
        general: 'Error de conexión. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.username.trim() && formData.password.trim() && formData.password.length >= 6;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors.general && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-error text-sm font-medium">{errors.general}</p>
              {loginAttempts >= 3 && (
                <p className="text-error-600 text-xs mt-1">
                  Múltiples intentos fallidos detectados. Verifica tus credenciales.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Username Field */}
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-text-primary">
            Usuario
          </label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`pl-10 ${errors.username ? 'border-error focus:border-error focus:ring-error-200' : ''}`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="User" size={18} color="var(--color-text-secondary)" />
            </div>
          </div>
          {errors.username && (
            <p className="text-error text-xs flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.username}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-text-primary">
            Contraseña
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`pl-10 pr-10 ${errors.password ? 'border-error focus:border-error focus:ring-error-200' : ''}`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Lock" size={18} color="var(--color-text-secondary)" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary transition-smooth"
              disabled={isLoading}
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>
          {errors.password && (
            <p className="text-error text-xs flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          iconName="LogIn"
          iconPosition="left"
          fullWidth
          className="h-12"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        {/* Demo Credentials Info */}
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} color="var(--color-secondary)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-secondary text-xs font-medium mb-1">Credenciales de demostración:</p>
              <p className="text-secondary-600 text-xs">
                <span className="font-data">Usuario:</span> admin<br />
                <span className="font-data">Contraseña:</span> admin123
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
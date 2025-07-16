import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoginFooter = () => {
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState('');

  const handlePasswordRecovery = (e) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      setRecoveryStatus('Por favor, ingresa tu email');
      return;
    }
    
    // Mock recovery process
    setRecoveryStatus('Instrucciones enviadas a tu email');
    setTimeout(() => {
      setShowRecovery(false);
      setRecoveryStatus('');
      setRecoveryEmail('');
    }, 3000);
  };

  const systemStatus = {
    status: 'operational',
    message: 'Todos los sistemas funcionando correctamente',
    lastUpdate: new Date().toLocaleString('es-ES')
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Password Recovery */}
      <div className="text-center">
        {!showRecovery ? (
          <button
            onClick={() => setShowRecovery(true)}
            className="text-primary hover:text-primary-700 text-sm font-medium transition-smooth"
          >
            ¿Olvidaste tu contraseña?
          </button>
        ) : (
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <form onSubmit={handlePasswordRecovery} className="space-y-3">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Mail" size={16} color="var(--color-secondary)" />
                <span className="text-sm font-medium text-text-primary">Recuperar contraseña</span>
              </div>
              <input
                type="email"
                placeholder="Ingresa tu email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary"
              />
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 text-xs py-2"
                >
                  Enviar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowRecovery(false)}
                  className="flex-1 text-xs py-2"
                >
                  Cancelar
                </Button>
              </div>
              {recoveryStatus && (
                <p className={`text-xs ${recoveryStatus.includes('enviadas') ? 'text-success' : 'text-error'}`}>
                  {recoveryStatus}
                </p>
              )}
            </form>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              systemStatus.status === 'operational' ? 'bg-success' : 
              systemStatus.status === 'maintenance' ? 'bg-warning' : 'bg-error'
            }`}></div>
            <div>
              <p className="text-sm font-medium text-text-primary">Estado del Sistema</p>
              <p className="text-xs text-text-secondary">{systemStatus.message}</p>
            </div>
          </div>
          <Icon 
            name={systemStatus.status === 'operational' ? 'CheckCircle' : 'AlertCircle'} 
            size={20} 
            color={systemStatus.status === 'operational' ? 'var(--color-success)' : 'var(--color-warning)'} 
          />
        </div>
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-text-muted">
            Última actualización: {systemStatus.lastUpdate}
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-warning-700 text-xs font-medium mb-1">Aviso de Seguridad</p>
            <p className="text-warning-600 text-xs">
              Tu sesión expirará automáticamente después de 30 minutos de inactividad. 
              Nunca compartas tus credenciales de acceso.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-center space-y-2">
        <div className="flex justify-center space-x-4 text-xs text-text-muted">
          <a href="#" className="hover:text-text-secondary transition-smooth">Términos de Uso</a>
          <span>•</span>
          <a href="#" className="hover:text-text-secondary transition-smooth">Política de Privacidad</a>
          <span>•</span>
          <a href="#" className="hover:text-text-secondary transition-smooth">Soporte</a>
        </div>
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} AmazonScraper Pro. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginFooter;
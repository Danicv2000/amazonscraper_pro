import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const quickActions = [
    {
      id: 'new-product',
      title: 'Añadir Producto',
      description: 'Agregar nuevo producto al catálogo',
      icon: 'Plus',
      color: 'primary',
      action: () => navigate('/admin/products/new')
    },
    {
      id: 'export-orders',
      title: 'Exportar Pedidos',
      description: 'Descargar reporte de pedidos',
      icon: 'Download',
      color: 'secondary',
      action: handleExportOrders
    },
    {
      id: 'view-analytics',
      title: 'Ver Análisis',
      description: 'Análisis detallado de ventas',
      icon: 'TrendingUp',
      color: 'success',
      action: () => navigate('/admin/analytics')
    },
    {
      id: 'manage-products',
      title: 'Gestionar Productos',
      description: 'Administrar catálogo completo',
      icon: 'Package',
      color: 'accent',
      action: () => navigate('/admin/products')
    }
  ];

  async function handleExportOrders() {
    setIsExporting(true);
    
    try {
      // Mock export functionality
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would generate and download a CSV/Excel file
      const mockData = `ID Pedido,Cliente,Total,Fecha,Estado
ORD-2024-001,María García,€299.99,15/01/2024,Pendiente
ORD-2024-002,Carlos Rodríguez,€515.97,15/01/2024,Procesando
ORD-2024-003,Ana Martínez,€599.99,14/01/2024,Completado`;

      const blob = new Blob([mockData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting orders:', error);
    } finally {
      setIsExporting(false);
    }
  }

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      type: 'order',
      message: 'Nuevo pedido de María García',
      time: '5 min',
      icon: 'ShoppingCart',
      color: 'primary'
    },
    {
      id: 2,
      type: 'product',
      message: 'Producto agotado: Samsung Galaxy A54',
      time: '15 min',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      id: 3,
      type: 'whatsapp',
      message: 'Mensaje de WhatsApp confirmado',
      time: '32 min',
      icon: 'MessageCircle',
      color: 'success'
    },
    {
      id: 4,
      type: 'analytics',
      message: 'Reporte semanal generado',
      time: '1 h',
      icon: 'BarChart3',
      color: 'secondary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Acciones Rápidas</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                onClick={action.action}
                loading={action.id === 'export-orders' && isExporting}
                className="flex items-center justify-start p-4 h-auto border border-border hover:border-primary-200 hover:bg-primary-50 transition-smooth"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${action.color}-50 mr-3`}>
                  <Icon name={action.icon} size={20} color={`var(--color-${action.color})`} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-text-primary">{action.title}</p>
                  <p className="text-sm text-text-secondary">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Actividad Reciente</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${activity.color}-50 flex-shrink-0`}>
                  <Icon name={activity.icon} size={16} color={`var(--color-${activity.color})`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">{activity.message}</p>
                  <p className="text-xs text-text-secondary">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/activity')}
              iconName="ArrowRight"
              iconPosition="right"
              className="w-full justify-center"
            >
              Ver toda la actividad
            </Button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Estado del Sistema</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-text-primary">Scraping de Amazon</span>
              </div>
              <span className="text-xs text-success font-medium">Activo</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-text-primary">WhatsApp API</span>
              </div>
              <span className="text-xs text-success font-medium">Conectado</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-text-primary">Base de Datos</span>
              </div>
              <span className="text-xs text-warning font-medium">Lenta</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-text-primary">Servidor</span>
              </div>
              <span className="text-xs text-success font-medium">Operativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
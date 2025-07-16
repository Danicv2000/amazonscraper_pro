import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../../components/ui/AdminNavigation';
import { ProtectedAdminRoute, useSessionTimeout } from '../../components/ui/AuthGuard';
import MetricsCard from './components/MetricsCard';
import RecentOrdersTable from './components/RecentOrdersTable';
import BestSellingChart from './components/BestSellingChart';
import QuickActions from './components/QuickActions';
import DateRangePicker from './components/DateRangePicker';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    rangeId: '7d'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Enable session timeout
  useSessionTimeout();

  // Mock dashboard metrics based on date range
  const mockDashboardData = {
    metrics: {
      totalOrders: 147,
      totalRevenue: 45678.90,
      estimatedProfit: 6851.84,
      conversionRate: 3.2,
      avgOrderValue: 310.74,
      whatsappMessages: 89,
      completedOrders: 134,
      pendingOrders: 13
    },
    trends: {
      orders: { change: 12.5, type: 'positive' },
      revenue: { change: 8.3, type: 'positive' },
      profit: { change: -2.1, type: 'negative' },
      conversion: { change: 0.8, type: 'positive' }
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData(mockDashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [dateRange]);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      // Mock refresh delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setDashboardData(mockDashboardData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <ProtectedAdminRoute>
        <div className="min-h-screen bg-background">
          <AdminNavigation />
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Cargando panel de administración...</p>
            </div>
          </div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-text-primary">Panel de Administración</h1>
                <p className="text-text-secondary mt-1">
                  Resumen de ventas y análisis de AmazonScraper Pro
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <DateRangePicker 
                  onDateRangeChange={handleDateRangeChange}
                  className="hidden sm:block"
                />
                <Button
                  variant="secondary"
                  onClick={handleRefreshData}
                  loading={isLoading}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Actualizar
                </Button>
              </div>
            </div>
            
            {/* Mobile Date Picker */}
            <div className="sm:hidden mt-4">
              <DateRangePicker onDateRangeChange={handleDateRangeChange} />
            </div>
          </div>

          {/* Metrics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total de Pedidos"
              value={dashboardData?.metrics.totalOrders || 0}
              change={dashboardData?.trends.orders.change}
              changeType={dashboardData?.trends.orders.type}
              icon="ShoppingCart"
              color="primary"
            />
            <MetricsCard
              title="Ingresos Totales"
              value={dashboardData?.metrics.totalRevenue || 0}
              change={dashboardData?.trends.revenue.change}
              changeType={dashboardData?.trends.revenue.type}
              icon="Euro"
              color="success"
              currency={true}
            />
            <MetricsCard
              title="Beneficio Estimado"
              value={dashboardData?.metrics.estimatedProfit || 0}
              change={dashboardData?.trends.profit.change}
              changeType={dashboardData?.trends.profit.type}
              icon="TrendingUp"
              color="accent"
              currency={true}
            />
            <MetricsCard
              title="Tasa de Conversión"
              value={dashboardData?.metrics.conversionRate || 0}
              change={dashboardData?.trends.conversion.change}
              changeType={dashboardData?.trends.conversion.type}
              icon="Target"
              color="secondary"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Icon name="MessageCircle" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Mensajes WhatsApp</p>
                  <p className="text-xl font-bold text-text-primary font-data">
                    {dashboardData?.metrics.whatsappMessages || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Pedidos Completados</p>
                  <p className="text-xl font-bold text-text-primary font-data">
                    {dashboardData?.metrics.completedOrders || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} color="var(--color-warning)" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Pedidos Pendientes</p>
                  <p className="text-xl font-bold text-text-primary font-data">
                    {dashboardData?.metrics.pendingOrders || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={20} color="var(--color-accent)" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Valor Promedio</p>
                  <p className="text-xl font-bold text-text-primary font-data">
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(dashboardData?.metrics.avgOrderValue || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Orders Table - 8 columns */}
            <div className="lg:col-span-8">
              <RecentOrdersTable />
            </div>

            {/* Right Sidebar - 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              <BestSellingChart />
              <QuickActions />
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-8 bg-surface rounded-lg border border-border p-6 shadow-elevation-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Resumen del Sistema</h3>
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/analytics')}
                iconName="BarChart3"
                iconPosition="left"
              >
                Ver análisis completo
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Globe" size={24} color="var(--color-primary)" />
                </div>
                <p className="text-2xl font-bold text-text-primary font-data">24/7</p>
                <p className="text-sm text-text-secondary">Scraping Activo</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Zap" size={24} color="var(--color-success)" />
                </div>
                <p className="text-2xl font-bold text-text-primary font-data">99.9%</p>
                <p className="text-sm text-text-secondary">Tiempo de Actividad</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Database" size={24} color="var(--color-accent)" />
                </div>
                <p className="text-2xl font-bold text-text-primary font-data">1.2M+</p>
                <p className="text-sm text-text-secondary">Productos Indexados</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminDashboard;
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import Button from '../../../components/ui/Button';

const BestSellingChart = () => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('7d');

  // Mock best-selling products data
  const mockData = [
    {
      name: 'Samsung Galaxy A54',
      sales: 45,
      revenue: 13497.55,
      profit: 2024.63,
      category: 'Smartphones'
    },
    {
      name: 'Sony WH-1000XM4',
      sales: 32,
      revenue: 7999.68,
      profit: 1199.95,
      category: 'Audio'
    },
    {
      name: 'iPad Air 64GB',
      sales: 28,
      revenue: 16799.72,
      profit: 2519.96,
      category: 'Tablets'
    },
    {
      name: 'ASUS VivoBook',
      sales: 24,
      revenue: 13199.76,
      profit: 1979.96,
      category: 'Laptops'
    },
    {
      name: 'Samsung TV 55"',
      sales: 18,
      revenue: 8099.82,
      profit: 1214.97,
      category: 'TV'
    }
  ];

  const colors = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-3">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-text-secondary">
              Ventas: <span className="font-data font-bold text-primary">{data.sales}</span>
            </p>
            <p className="text-text-secondary">
              Ingresos: <span className="font-data font-bold text-success">{formatPrice(data.revenue)}</span>
            </p>
            <p className="text-text-secondary">
              Beneficio: <span className="font-data font-bold text-accent">{formatPrice(data.profit)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-3">
          <p className="font-medium text-text-primary mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-text-secondary">
              Ventas: <span className="font-data font-bold text-primary">{data.sales}</span>
            </p>
            <p className="text-text-secondary">
              Porcentaje: <span className="font-data font-bold">{((data.sales / mockData.reduce((sum, item) => sum + item.sales, 0)) * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Productos Más Vendidos</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'bar' ? 'primary' : 'ghost'}
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
              className="p-2"
              aria-label="Gráfico de barras"
            />
            <Button
              variant={chartType === 'pie' ? 'primary' : 'ghost'}
              onClick={() => setChartType('pie')}
              iconName="PieChart"
              className="p-2"
              aria-label="Gráfico circular"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === '7d' ? 'primary' : 'ghost'}
            onClick={() => setTimeRange('7d')}
            className="text-sm px-3 py-1"
          >
            7 días
          </Button>
          <Button
            variant={timeRange === '30d' ? 'primary' : 'ghost'}
            onClick={() => setTimeRange('30d')}
            className="text-sm px-3 py-1"
          >
            30 días
          </Button>
          <Button
            variant={timeRange === '90d' ? 'primary' : 'ghost'}
            onClick={() => setTimeRange('90d')}
            className="text-sm px-3 py-1"
          >
            90 días
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="h-80 w-full" aria-label="Gráfico de productos más vendidos">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={mockData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {mockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Product List */}
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-text-primary">Detalles de Productos</h4>
          {mockData.slice(0, 3).map((product, index) => (
            <div key={product.name} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index] }}></div>
                <div>
                  <p className="font-medium text-text-primary text-sm">{product.name}</p>
                  <p className="text-xs text-text-secondary">{product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-data font-bold text-primary text-sm">{product.sales} ventas</p>
                <p className="text-xs text-text-secondary">{formatPrice(product.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellingChart;
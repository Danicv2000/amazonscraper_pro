import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentOrdersTable = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Mock recent orders data
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'María García',
      products: [
        { name: 'Smartphone Samsung Galaxy A54', quantity: 1, price: 299.99 }
      ],
      total: 299.99,
      whatsappStatus: 'enviado',
      date: new Date('2024-01-15T10:30:00'),
      status: 'pendiente'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Carlos Rodríguez',
      products: [
        { name: 'Auriculares Sony WH-1000XM4', quantity: 2, price: 249.99 },
        { name: 'Cable USB-C', quantity: 1, price: 15.99 }
      ],
      total: 515.97,
      whatsappStatus: 'confirmado',
      date: new Date('2024-01-15T09:15:00'),
      status: 'procesando'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Ana Martínez',
      products: [
        { name: 'Tablet iPad Air 64GB', quantity: 1, price: 599.99 }
      ],
      total: 599.99,
      whatsappStatus: 'entregado',
      date: new Date('2024-01-14T16:45:00'),
      status: 'completado'
    },
    {
      id: 'ORD-2024-004',
      customer: 'Luis Fernández',
      products: [
        { name: 'Smart TV Samsung 55"', quantity: 1, price: 449.99 }
      ],
      total: 449.99,
      whatsappStatus: 'enviado',
      date: new Date('2024-01-14T14:20:00'),
      status: 'pendiente'
    },
    {
      id: 'ORD-2024-005',
      customer: 'Elena Jiménez',
      products: [
        { name: 'Laptop ASUS VivoBook', quantity: 1, price: 549.99 },
        { name: 'Mouse inalámbrico', quantity: 1, price: 29.99 }
      ],
      total: 579.98,
      whatsappStatus: 'confirmado',
      date: new Date('2024-01-14T11:10:00'),
      status: 'procesando'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendiente: { color: 'warning', label: 'Pendiente' },
      procesando: { color: 'primary', label: 'Procesando' },
      completado: { color: 'success', label: 'Completado' },
      cancelado: { color: 'error', label: 'Cancelado' }
    };

    const config = statusConfig[status] || statusConfig.pendiente;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </span>
    );
  };

  const getWhatsAppStatusIcon = (status) => {
    const statusConfig = {
      enviado: { icon: 'Send', color: 'var(--color-primary)' },
      confirmado: { icon: 'CheckCircle', color: 'var(--color-success)' },
      entregado: { icon: 'Package', color: 'var(--color-success)' },
      pendiente: { icon: 'Clock', color: 'var(--color-warning)' }
    };

    const config = statusConfig[status] || statusConfig.pendiente;
    
    return (
      <div className="flex items-center space-x-1">
        <Icon name={config.icon} size={16} color={config.color} />
        <span className="text-sm capitalize">{status}</span>
      </div>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...mockOrders].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'date') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleViewOrder = (orderId) => {
    // In real app, this would navigate to order detail page
    console.log('Viewing order:', orderId);
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Pedidos Recientes</h3>
          <Button
            variant="secondary"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => navigate('/admin/orders')}
          >
            Ver todos
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary transition-smooth"
                >
                  <span>ID Pedido</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('customer')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary transition-smooth"
                >
                  <span>Cliente</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('total')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary transition-smooth"
                >
                  <span>Total</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                WhatsApp
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary transition-smooth"
                >
                  <span>Fecha</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-secondary-50 transition-smooth">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-data font-medium text-primary">
                    {order.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-text-primary">
                    {order.customer}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    {order.products.map((product, index) => (
                      <div key={index} className="text-sm text-text-secondary truncate">
                        {product.quantity}x {product.name}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-data font-bold text-text-primary">
                    {formatPrice(order.total)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getWhatsAppStatusIcon(order.whatsappStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-text-secondary">
                    {formatDate(order.date)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    variant="ghost"
                    iconName="Eye"
                    onClick={() => handleViewOrder(order.id)}
                    className="p-2"
                    aria-label="Ver pedido"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
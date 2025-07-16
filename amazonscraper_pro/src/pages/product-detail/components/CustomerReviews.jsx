import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerReviews = ({ reviews = [], productRating = 0, totalReviews = 0, className = '' }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock reviews if none provided
  const mockReviews = [
    {
      id: '1',
      author: 'María González',
      rating: 5,
      date: '2024-01-10',
      title: 'Excelente teléfono, muy recomendado',
      content: `Estoy muy satisfecha con esta compra. El teléfono funciona perfectamente, la cámara es increíble y la batería dura todo el día. La pantalla es muy nítida y los colores se ven geniales.\n\nLa entrega fue rápida y llegó en perfectas condiciones. Definitivamente lo recomiendo.`,
      verified: true,
      helpful: 23
    },
    {
      id: '2',
      author: 'Carlos Rodríguez',
      rating: 4,
      date: '2024-01-08',
      title: 'Buena relación calidad-precio',
      content: `El Samsung Galaxy A54 cumple con las expectativas. El rendimiento es bueno para el precio, aunque a veces se nota un poco lento en aplicaciones pesadas. La cámara hace fotos decentes y el diseño es elegante.`,
      verified: true,
      helpful: 15
    },
    {
      id: '3',
      author: 'Ana Martín',
      rating: 5,
      date: '2024-01-05',
      title: 'Perfecto para mi uso diario',
      content: `Lo uso principalmente para redes sociales, fotos y llamadas. Para eso es perfecto. La batería me dura fácilmente un día completo y la carga rápida es muy conveniente.`,
      verified: false,
      helpful: 8
    },
    {
      id: '4',
      author: 'David López',
      rating: 3,
      date: '2024-01-03',
      title: 'Correcto pero con algunos fallos',
      content: `En general está bien, pero he tenido algunos problemas con la conectividad WiFi. El soporte técnico me ayudó a solucionarlo parcialmente. Por el precio está bien.`,
      verified: true,
      helpful: 5
    },
    {
      id: '5',
      author: 'Laura Fernández',
      rating: 5,
      date: '2024-01-01',
      title: '¡Me encanta!',
      content: `Súper contenta con el teléfono. Venía de un iPhone y la transición ha sido muy fácil. La interfaz de Samsung es intuitiva y las funciones de cámara son geniales.`,
      verified: true,
      helpful: 12
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : mockReviews;
  const displayRating = productRating || 4.5;
  const displayTotal = totalReviews || 1247;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderStars = (rating, size = 16) => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={size}
        color={i < Math.floor(rating) ? "var(--color-accent)" : "var(--color-secondary-300)"}
        className={i < Math.floor(rating) ? "fill-current" : ""}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    displayReviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    const total = displayReviews.length;
    return Object.entries(distribution).reverse().map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  };

  const filteredReviews = selectedFilter === 'all' 
    ? displayReviews 
    : displayReviews.filter(review => review.rating === parseInt(selectedFilter));

  const visibleReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
          Valoraciones de clientes
        </h2>
        <Button
          variant="ghost"
          className="text-primary hover:text-primary-700"
        >
          Escribir reseña
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="bg-surface-secondary p-6 rounded-lg border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <span className="text-4xl font-data font-bold text-primary">
                {displayRating}
              </span>
              <div className="flex items-center">
                {renderStars(displayRating, 20)}
              </div>
            </div>
            <p className="text-text-secondary">
              Basado en {displayTotal.toLocaleString('es-ES')} valoraciones
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {getRatingDistribution().map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm font-medium text-text-secondary w-8">
                  {rating}★
                </span>
                <div className="flex-1 bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-smooth"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-text-secondary w-8">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedFilter === 'all' ? 'primary' : 'ghost'}
          onClick={() => setSelectedFilter('all')}
          className="text-sm"
        >
          Todas ({displayReviews.length})
        </Button>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = displayReviews.filter(r => r.rating === rating).length;
          if (count === 0) return null;
          
          return (
            <Button
              key={rating}
              variant={selectedFilter === rating.toString() ? 'primary' : 'ghost'}
              onClick={() => setSelectedFilter(rating.toString())}
              className="text-sm"
            >
              {rating}★ ({count})
            </Button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <div key={review.id} className="bg-surface p-4 rounded-lg border border-border">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="var(--color-text-secondary)" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary">{review.author}</span>
                    {review.verified && (
                      <span className="bg-success text-success-foreground px-2 py-0.5 rounded text-xs font-medium">
                        Compra verificada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      {renderStars(review.rating, 14)}
                    </div>
                    <span className="text-sm text-text-secondary">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="mb-3">
              <h4 className="font-medium text-text-primary mb-2">{review.title}</h4>
              <div className="text-text-secondary leading-relaxed">
                {review.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <Button
                variant="ghost"
                className="text-text-secondary hover:text-text-primary text-sm"
                iconName="ThumbsUp"
                iconPosition="left"
              >
                Útil ({review.helpful})
              </Button>
              <Button
                variant="ghost"
                className="text-text-secondary hover:text-text-primary text-sm"
                iconName="Flag"
                iconPosition="left"
              >
                Reportar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {filteredReviews.length > 3 && (
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={() => setShowAllReviews(!showAllReviews)}
            iconName={showAllReviews ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAllReviews 
              ? 'Ver menos reseñas' 
              : `Ver todas las reseñas (${filteredReviews.length - 3} más)`
            }
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
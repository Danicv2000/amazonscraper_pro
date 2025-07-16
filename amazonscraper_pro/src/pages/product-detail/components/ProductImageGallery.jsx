import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductImageGallery = ({ images = [], productName = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Mock images if none provided
  const mockImages = [
    '/assets/images/no_image.png',
    '/assets/images/no_image.png',
    '/assets/images/no_image.png',
    '/assets/images/no_image.png'
  ];

  const displayImages = images.length > 0 ? images : mockImages;

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square bg-surface rounded-lg border border-border overflow-hidden group">
        <Image
          src={displayImages[currentImageIndex]}
          alt={`${productName} - Imagen ${currentImageIndex + 1}`}
          className={`w-full h-full object-contain transition-smooth cursor-zoom-in ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          onClick={toggleZoom}
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface bg-opacity-80 hover:bg-opacity-100 shadow-elevation-2 opacity-0 group-hover:opacity-100 transition-smooth"
              iconName="ChevronLeft"
              aria-label="Imagen anterior"
            />
            <Button
              variant="ghost"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface bg-opacity-80 hover:bg-opacity-100 shadow-elevation-2 opacity-0 group-hover:opacity-100 transition-smooth"
              iconName="ChevronRight"
              aria-label="Siguiente imagen"
            />
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-surface bg-opacity-80 px-2 py-1 rounded text-xs font-data">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Zoom Indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
          <div className="bg-surface bg-opacity-80 p-1 rounded">
            <Icon name="ZoomIn" size={16} color="var(--color-text-secondary)" />
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-smooth ${
                index === currentImageIndex
                  ? 'border-primary shadow-elevation-2'
                  : 'border-border hover:border-primary-200'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal for Mobile */}
      {isZoomed && (
        <div className="fixed inset-0 z-300 bg-black bg-opacity-90 flex items-center justify-center p-4 md:hidden">
          <div className="relative max-w-full max-h-full">
            <Image
              src={displayImages[currentImageIndex]}
              alt={`${productName} - Vista ampliada`}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="ghost"
              onClick={toggleZoom}
              className="absolute top-4 right-4 w-10 h-10 bg-surface bg-opacity-80 hover:bg-opacity-100"
              iconName="X"
              aria-label="Cerrar vista ampliada"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';

const QuantitySelector = ({ 
  initialQuantity = 1, 
  maxQuantity = 10, 
  minQuantity = 1,
  onQuantityChange,
  disabled = false,
  className = ''
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < minQuantity || newQuantity > maxQuantity || disabled) return;
    
    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || minQuantity;
    handleQuantityChange(Math.min(Math.max(value, minQuantity), maxQuantity));
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <span className="text-sm font-medium text-text-secondary mr-3">Cantidad:</span>
      
      <div className="flex items-center border border-border rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          onClick={decrementQuantity}
          disabled={disabled || quantity <= minQuantity}
          className="w-10 h-10 p-0 rounded-none border-0 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          iconName="Minus"
          aria-label="Disminuir cantidad"
        />
        
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={minQuantity}
          max={maxQuantity}
          disabled={disabled}
          className="w-16 h-10 text-center border-0 border-l border-r border-border focus:outline-none focus:ring-2 focus:ring-primary-200 font-data font-medium text-text-primary disabled:bg-secondary-50 disabled:cursor-not-allowed"
        />
        
        <Button
          variant="ghost"
          onClick={incrementQuantity}
          disabled={disabled || quantity >= maxQuantity}
          className="w-10 h-10 p-0 rounded-none border-0 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          iconName="Plus"
          aria-label="Aumentar cantidad"
        />
      </div>
      
      {maxQuantity > 1 && (
        <span className="text-xs text-text-muted ml-2">
          Máx: {maxQuantity}
        </span>
      )}
    </div>
  );
};

export default QuantitySelector;
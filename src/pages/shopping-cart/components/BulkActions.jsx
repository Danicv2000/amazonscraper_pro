import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  items = [], 
  selectedItems = [], 
  onSelectAll, 
  onSelectItem, 
  onRemoveSelected, 
  onClearCart,
  className = '' 
}) => {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0;

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(!allSelected);
    }
  };

  const handleClearCart = async () => {
    setIsProcessing(true);
    try {
      if (onClearCart) {
        await onClearCart();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsProcessing(false);
      setShowClearDialog(false);
    }
  };

  const handleRemoveSelected = async () => {
    setIsProcessing(true);
    try {
      if (onRemoveSelected) {
        await onRemoveSelected(selectedItems);
      }
    } catch (error) {
      console.error('Error removing selected items:', error);
    } finally {
      setIsProcessing(false);
      setShowRemoveDialog(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`bg-surface rounded-lg border border-border p-4 ${className}`}>
        <div className="flex items-center justify-between">
          {/* Select All */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="text-primary focus:ring-primary-200 rounded"
              />
              <span className="text-sm font-medium text-text-primary">
                {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </span>
            </label>
            
            {someSelected && (
              <span className="text-xs text-text-secondary bg-secondary-100 px-2 py-1 rounded-full">
                {selectedItems.length} de {items.length} seleccionados
              </span>
            )}
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center space-x-2">
            {someSelected && (
              <Button
                variant="danger"
                onClick={() => setShowRemoveDialog(true)}
                iconName="Trash2"
                iconPosition="left"
                className="text-sm"
                disabled={isProcessing}
              >
                Eliminar seleccionados
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(true)}
              iconName="RotateCcw"
              iconPosition="left"
              className="text-sm"
              disabled={isProcessing}
            >
              Vaciar carrito
            </Button>
          </div>
        </div>

        {/* Selection Info */}
        {someSelected && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                Productos seleccionados: {selectedItems.length}
              </span>
              <span className="font-data text-primary font-medium">
                Total: {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(
                  items
                    .filter(item => selectedItems.includes(item.id))
                    .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowClearDialog(false)} />
          <div className="relative bg-surface rounded-lg border border-border p-6 max-w-md w-full shadow-elevation-4">
            <div className="text-center">
              <Icon name="AlertTriangle" size={48} color="var(--color-warning)" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                ¿Vaciar carrito?
              </h3>
              <p className="text-text-secondary mb-6">
                Esta acción eliminará todos los productos de tu carrito. No podrás deshacer esta acción.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowClearDialog(false)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleClearCart}
                  loading={isProcessing}
                  iconName="Trash2"
                  iconPosition="left"
                  className="flex-1"
                >
                  Vaciar carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Selected Confirmation Dialog */}
      {showRemoveDialog && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowRemoveDialog(false)} />
          <div className="relative bg-surface rounded-lg border border-border p-6 max-w-md w-full shadow-elevation-4">
            <div className="text-center">
              <Icon name="AlertTriangle" size={48} color="var(--color-warning)" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                ¿Eliminar productos seleccionados?
              </h3>
              <p className="text-text-secondary mb-6">
                Se eliminarán {selectedItems.length} productos del carrito. Esta acción no se puede deshacer.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowRemoveDialog(false)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRemoveSelected}
                  loading={isProcessing}
                  iconName="Trash2"
                  iconPosition="left"
                  className="flex-1"
                >
                  Eliminar seleccionados
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;
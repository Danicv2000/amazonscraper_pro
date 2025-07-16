import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DateRangePicker = ({ onDateRangeChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('7d');
  const [customRange, setCustomRange] = useState({
    startDate: '',
    endDate: ''
  });

  const predefinedRanges = [
    { id: '7d', label: 'Últimos 7 días', days: 7 },
    { id: '30d', label: 'Últimos 30 días', days: 30 },
    { id: '90d', label: 'Últimos 90 días', days: 90 },
    { id: 'custom', label: 'Rango personalizado', days: null }
  ];

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getDateRange = (rangeId, days = null) => {
    const endDate = new Date();
    const startDate = new Date();
    
    if (days) {
      startDate.setDate(endDate.getDate() - days);
    }
    
    return { startDate, endDate };
  };

  const getCurrentRangeLabel = () => {
    const range = predefinedRanges.find(r => r.id === selectedRange);
    if (selectedRange === 'custom' && customRange.startDate && customRange.endDate) {
      return `${formatDate(new Date(customRange.startDate))} - ${formatDate(new Date(customRange.endDate))}`;
    }
    return range?.label || 'Seleccionar rango';
  };

  const handleRangeSelect = (rangeId) => {
    setSelectedRange(rangeId);
    
    if (rangeId !== 'custom') {
      const range = predefinedRanges.find(r => r.id === rangeId);
      const { startDate, endDate } = getDateRange(rangeId, range.days);
      
      if (onDateRangeChange) {
        onDateRangeChange({ startDate, endDate, rangeId });
      }
      setIsOpen(false);
    }
  };

  const handleCustomRangeChange = (field, value) => {
    const newCustomRange = { ...customRange, [field]: value };
    setCustomRange(newCustomRange);
    
    if (newCustomRange.startDate && newCustomRange.endDate) {
      const startDate = new Date(newCustomRange.startDate);
      const endDate = new Date(newCustomRange.endDate);
      
      if (startDate <= endDate && onDateRangeChange) {
        onDateRangeChange({ startDate, endDate, rangeId: 'custom' });
      }
    }
  };

  const applyCustomRange = () => {
    if (customRange.startDate && customRange.endDate) {
      const startDate = new Date(customRange.startDate);
      const endDate = new Date(customRange.endDate);
      
      if (startDate <= endDate) {
        if (onDateRangeChange) {
          onDateRangeChange({ startDate, endDate, rangeId: 'custom' });
        }
        setIsOpen(false);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Calendar"
        iconPosition="left"
        className="justify-between min-w-[200px]"
      >
        <span className="truncate">{getCurrentRangeLabel()}</span>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} />
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-100" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-elevation-3 z-200 animate-slide-down">
            <div className="p-4">
              <h4 className="font-medium text-text-primary mb-3">Seleccionar período</h4>
              
              <div className="space-y-2 mb-4">
                {predefinedRanges.map((range) => (
                  <Button
                    key={range.id}
                    variant={selectedRange === range.id ? 'primary' : 'ghost'}
                    onClick={() => handleRangeSelect(range.id)}
                    className="w-full justify-start"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>

              {selectedRange === 'custom' && (
                <div className="border-t border-border pt-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Fecha de inicio
                      </label>
                      <Input
                        type="date"
                        value={customRange.startDate}
                        onChange={(e) => handleCustomRangeChange('startDate', e.target.value)}
                        max={customRange.endDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Fecha de fin
                      </label>
                      <Input
                        type="date"
                        value={customRange.endDate}
                        onChange={(e) => handleCustomRangeChange('endDate', e.target.value)}
                        min={customRange.startDate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setCustomRange({ startDate: '', endDate: '' });
                          setSelectedRange('7d');
                          setIsOpen(false);
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={applyCustomRange}
                        disabled={!customRange.startDate || !customRange.endDate}
                        className="flex-1"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;
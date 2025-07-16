import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep = 3, className = '' }) => {
  const steps = [
    { id: 1, name: 'Productos', icon: 'ShoppingBag', completed: true },
    { id: 2, name: 'Carrito', icon: 'ShoppingCart', completed: true },
    { id: 3, name: 'WhatsApp', icon: 'MessageCircle', completed: false, current: true },
    { id: 4, name: 'Confirmación', icon: 'CheckCircle', completed: false }
  ];

  return (
    <div className={`bg-surface rounded-lg border border-border shadow-elevation-1 ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-smooth ${
                  step.completed 
                    ? 'bg-success text-success-foreground' 
                    : step.current 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary-200 text-text-muted'
                }`}>
                  <Icon 
                    name={step.completed ? 'Check' : step.icon} 
                    size={18} 
                    color="currentColor" 
                  />
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  step.current 
                    ? 'text-primary' 
                    : step.completed 
                      ? 'text-success' :'text-text-muted'
                }`}>
                  {step.name}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div className={`h-0.5 transition-smooth ${
                    steps[index + 1].completed || steps[index + 1].current
                      ? 'bg-success' :'bg-secondary-200'
                  }`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
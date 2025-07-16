import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WhatsAppMessagePreview = ({ 
  message = '', 
  onCopyMessage, 
  loading = false,
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      if (onCopyMessage) {
        onCopyMessage();
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying message:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = message;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className={`bg-surface rounded-lg border border-border shadow-elevation-2 ${className}`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-secondary-200 rounded-full animate-pulse"></div>
            <div className="h-5 bg-secondary-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-secondary-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-secondary-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-secondary-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-secondary-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-lg border border-border shadow-elevation-2 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={18} color="white" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              Vista Previa del Mensaje
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={handleCopyMessage}
            iconName={copied ? "Check" : "Copy"}
            iconPosition="left"
            className={`text-sm ${copied ? 'text-success' : 'text-text-secondary'}`}
          >
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </div>

        <div className="bg-background rounded-lg border border-border-light p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="MessageCircle" size={20} color="white" />
            </div>
            <div className="flex-1">
              <div className="bg-success-100 rounded-lg rounded-tl-none p-3">
                <pre className="text-sm text-text-primary whitespace-pre-wrap font-sans leading-relaxed">
                  {message}
                </pre>
              </div>
              <div className="flex items-center justify-end mt-2 space-x-1">
                <span className="text-xs text-text-muted">
                  {new Date().toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <Icon name="Check" size={14} color="var(--color-success)" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-warning-700 font-medium mb-1">
                Información importante
              </p>
              <p className="text-sm text-warning-600">
                Este mensaje se enviará automáticamente a WhatsApp. Puedes editarlo antes de enviarlo si es necesario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessagePreview;
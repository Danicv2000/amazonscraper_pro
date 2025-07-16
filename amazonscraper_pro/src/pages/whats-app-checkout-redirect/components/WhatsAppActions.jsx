import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WhatsAppActions = ({ 
  whatsappUrl = 'https://wa.me/55525829', 
  message = '',
  onWhatsAppOpen,
  onCopyMessage,
  onRetry,
  loading = false,
  error = null,
  className = '' 
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleWhatsAppOpen = async () => {
    setIsOpening(true);
    try {
      if (onWhatsAppOpen) {
        await onWhatsAppOpen();
      }
      
      // Open WhatsApp with the generated URL
      window.open(whatsappUrl, '_blank');
      
      // Track the action
      setTimeout(() => {
        setIsOpening(false);
      }, 2000);
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      setIsOpening(false);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      if (onCopyMessage) {
        onCopyMessage();
      }
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Error copying message:', error);
    }
  };

  const generateQRCode = () => {
    // Generate QR code URL for WhatsApp link
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappUrl)}`;
    return qrUrl;
  };

  if (error) {
    return (
      <div className={`bg-surface rounded-lg border border-error-200 shadow-elevation-2 ${className}`}>
        <div className="p-6">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} color="var(--color-error)" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-error mb-2">
              Error al generar el mensaje
            </h3>
            <p className="text-text-secondary mb-6">
              {error}
            </p>
            <Button
              variant="primary"
              onClick={onRetry}
              iconName="RefreshCw"
              iconPosition="left"
              loading={loading}
            >
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-lg border border-border shadow-elevation-2 ${className}`}>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageCircle" size={32} color="var(--color-success)" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            ¡Pedido Listo!
          </h2>
          <p className="text-text-secondary">
            Tu pedido está preparado para enviarse por WhatsApp
          </p>
        </div>

        <div className="space-y-4">
          {/* Primary WhatsApp Button */}
          <Button
            variant="success"
            onClick={handleWhatsAppOpen}
            iconName="MessageCircle"
            iconPosition="left"
            loading={isOpening}
            fullWidth
            className="text-lg py-4"
          >
            {isOpening ? 'Abriendo WhatsApp...' : 'Abrir WhatsApp'}
          </Button>

          {/* Alternative Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={handleCopyMessage}
              iconName={copied ? "Check" : "Copy"}
              iconPosition="left"
              fullWidth
            >
              {copied ? 'Mensaje Copiado' : 'Copiar Mensaje'}
            </Button>

            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              iconName="ArrowLeft"
              iconPosition="left"
              fullWidth
            >
              Volver al Carrito
            </Button>
          </div>

          {/* QR Code for Mobile Access */}
          <div className="hidden md:block border-t border-border pt-6">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-4">
                Escanea este código QR desde tu móvil para abrir WhatsApp
              </p>
              <div className="inline-block p-4 bg-background rounded-lg border border-border">
                <img 
                  src={generateQRCode()} 
                  alt="Código QR para WhatsApp"
                  className="w-32 h-32"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-background rounded-lg p-4 border border-border-light">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  Información de contacto
                </p>
                <p className="text-sm text-text-secondary">
                  WhatsApp: +53 55525829\n
                  Email: pedidos@amazonscraper.com\n
                  Horario: Lunes a Viernes, 9:00 - 18:00
                </p>
              </div>
            </div>
          </div>

          {/* Fallback Options */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-text-muted text-center mb-3">
              ¿Problemas con WhatsApp? Usa estas alternativas:
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.location.href = 'mailto:pedidos@amazonscraper.com?subject=Pedido desde AmazonScraper Pro'}
                iconName="Mail"
                className="text-xs"
              >
                Email
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.href = 'tel:+53 55525829'}
                iconName="Phone"
                className="text-xs"
              >
                Llamar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppActions;
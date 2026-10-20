import { useEffect, useRef } from 'react';

export const useGenerateIcons = () => {
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (hasGenerated.current) return;
    hasGenerated.current = true;

    const generateIcon = (size: number): string => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) return '';

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#65a30d'); // lime-600
      gradient.addColorStop(1, '#16a34a'); // green-600
      ctx.fillStyle = gradient;

      // Rounded rectangle
      const radius = size * 0.15;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();

      // Draw "E" letter
      ctx.fillStyle = 'white';
      ctx.font = `bold ${size * 0.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('E', size / 2, size / 2);

      return canvas.toDataURL('image/png');
    };

    // Generate and store icons in localStorage as fallback
    try {
      if (!localStorage.getItem('pwa-icon-192')) {
        const icon192 = generateIcon(192);
        localStorage.setItem('pwa-icon-192', icon192);
      }
      if (!localStorage.getItem('pwa-icon-512')) {
        const icon512 = generateIcon(512);
        localStorage.setItem('pwa-icon-512', icon512);
      }
    } catch (error) {
      console.error('Failed to generate PWA icons:', error);
    }
  }, []);
};

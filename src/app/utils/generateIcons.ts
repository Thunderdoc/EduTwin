// Generate PWA icons programmatically

export const generateIcon = (size: number): string => {
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
  ctx.fillRect(0, 0, size, size);

  // Add rounded corners
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  const radius = size * 0.15;
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

  ctx.globalCompositeOperation = 'source-over';

  // Draw "E" letter (for EduFlow)
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('E', size / 2, size / 2);

  // Add a small graduation cap icon or book below
  ctx.font = `${size * 0.2}px Arial`;
  ctx.fillText('🎓', size / 2, size * 0.75);

  return canvas.toDataURL('image/png');
};

export const saveIconsToPublic = async () => {
  try {
    // Generate 192x192 icon
    const icon192 = generateIcon(192);
    const icon512 = generateIcon(512);

    // Save to localStorage for demo purposes
    // In production, these should be pre-generated and saved as actual files
    localStorage.setItem('pwa-icon-192', icon192);
    localStorage.setItem('pwa-icon-512', icon512);

    return { icon192, icon512 };
  } catch (error) {
    console.error('Error generating icons:', error);
    return null;
  }
};

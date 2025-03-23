/**
 * Color utility functions for Prism color palette generator
 */

/**
 * Converts a hex color to RGB format
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  // Remove # if present
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
  
  // Parse the hex values
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  
  return { r, g, b };
};

/**
 * Converts RGB to hex format
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Converts hex to HSL format
 */
export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const { r, g, b } = hexToRgb(hex);
  
  // Convert RGB to HSL
  const rNormalized = r / 255;
  const gNormalized = g / 255;
  const bNormalized = b / 255;
  
  const max = Math.max(rNormalized, gNormalized, bNormalized);
  const min = Math.min(rNormalized, gNormalized, bNormalized);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case rNormalized:
        h = (gNormalized - bNormalized) / d + (gNormalized < bNormalized ? 6 : 0);
        break;
      case gNormalized:
        h = (bNormalized - rNormalized) / d + 2;
        break;
      case bNormalized:
        h = (rNormalized - gNormalized) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  return { 
    h: Math.round(h * 360), 
    s: Math.round(s * 100), 
    l: Math.round(l * 100) 
  };
};

/**
 * Converts HSL to hex format
 */
export const hslToHex = (h: number, s: number, l: number): string => {
  // Normalize HSL values
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return rgbToHex(
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  );
};

/**
 * Generates a complementary color (opposite on the color wheel)
 */
export const getComplementaryColor = (hex: string): string => {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex((h + 180) % 360, s, l);
};

/**
 * Generates an analogous color scheme (colors adjacent on the color wheel)
 */
export const getAnalogousColors = (hex: string, count: number = 2): string[] => {
  const { h, s, l } = hexToHsl(hex);
  const colors = [hex];
  
  const angle = 30; // Typical angle for analogous colors
  
  for (let i = 1; i <= count; i++) {
    colors.push(hslToHex((h + angle * i) % 360, s, l));
    if (count > 1) {
      colors.unshift(hslToHex((h - angle * i + 360) % 360, s, l));
    }
  }
  
  return colors;
};

/**
 * Generates a triadic color scheme (three colors evenly spaced on the color wheel)
 */
export const getTriadicColors = (hex: string): string[] => {
  const { h, s, l } = hexToHsl(hex);
  return [
    hex,
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l)
  ];
};

/**
 * Generates a tetradic (rectangle) color scheme
 */
export const getTetradicColors = (hex: string): string[] => {
  const { h, s, l } = hexToHsl(hex);
  return [
    hex,
    hslToHex((h + 90) % 360, s, l),
    hslToHex((h + 180) % 360, s, l),
    hslToHex((h + 270) % 360, s, l)
  ];
};

/**
 * Generates a monochromatic color scheme (variations in lightness and saturation)
 */
export const getMonochromaticColors = (hex: string, count: number = 5): string[] => {
  const { h, s, l } = hexToHsl(hex);
  const colors = [];
  
  // Generate variations with different lightness
  for (let i = 0; i < count; i++) {
    const newL = Math.max(Math.min(l - 30 + (i * 15), 95), 5); // Vary lightness
    colors.push(hslToHex(h, s, newL));
  }
  
  return colors;
};

/**
 * Calculates the contrast ratio between two colors (WCAG)
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    
    // Normalize RGB values
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    // Convert to sRGB
    const rSrgb = rNorm <= 0.03928 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
    const gSrgb = gNorm <= 0.03928 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
    const bSrgb = bNorm <= 0.03928 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);
    
    // Calculate luminance
    return 0.2126 * rSrgb + 0.7152 * gSrgb + 0.0722 * bSrgb;
  };
  
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  // Calculate contrast ratio
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Checks if a color combination meets WCAG accessibility standards
 */
export const isAccessible = (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = getContrastRatio(foreground, background);
  
  // WCAG 2.0 standards
  if (level === 'AA') {
    return ratio >= 4.5; // AA requires 4.5:1 for normal text
  } else {
    return ratio >= 7; // AAA requires 7:1 for normal text
  }
};

/**
 * Generates a random color in hex format
 */
export const generateRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

/**
 * Generates a palette of random colors
 */
export const generateRandomPalette = (count: number = 5): string[] => {
  return Array.from({ length: count }, () => generateRandomColor());
};

/**
 * Formats colors for export in different formats
 */
export const formatColorsForExport = (colors: string[], format: 'css' | 'scss' | 'json'): string => {
  switch (format) {
    case 'css':
      return colors.map((color, index) => `--color-${index + 1}: ${color};`).join('\n');
    case 'scss':
      return colors.map((color, index) => `$color-${index + 1}: ${color};`).join('\n');
    case 'json':
      return JSON.stringify(colors.reduce((acc, color, index) => {
        acc[`color-${index + 1}`] = color;
        return acc;
      }, {} as Record<string, string>), null, 2);
    default:
      return JSON.stringify(colors);
  }
};
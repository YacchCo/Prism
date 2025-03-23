/**
 * Color naming utility functions for Prism color palette generator
 */

// Basic color name mapping
interface ColorNameMapping {
  name: string;
  hex: string;
}

// Array of common color names with their hex values
const colorNames: ColorNameMapping[] = [
  // Primary colors
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Blue', hex: '#0000FF' },
  
  // Secondary colors
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Magenta', hex: '#FF00FF' },
  
  // Tertiary colors
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Chartreuse', hex: '#7FFF00' },
  { name: 'Spring Green', hex: '#00FF7F' },
  { name: 'Azure', hex: '#007FFF' },
  { name: 'Violet', hex: '#7F00FF' },
  { name: 'Rose', hex: '#FF007F' },
  
  // Grayscale
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Black', hex: '#000000' },
  
  // Common colors
  { name: 'Maroon', hex: '#800000' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Plum', hex: '#DDA0DD' },
  { name: 'Salmon', hex: '#FA8072' },
  { name: 'Sienna', hex: '#A0522D' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Violet', hex: '#EE82EE' },
];

/**
 * Calculate the color difference between two colors (Euclidean distance in RGB space)
 */
const colorDifference = (hex1: string, hex2: string): number => {
  // Convert hex to RGB
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  
  // Calculate Euclidean distance
  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
};

/**
 * Get the closest color name for a given hex color
 */
export const getColorName = (hex: string): string => {
  // Normalize hex format
  const normalizedHex = hex.toUpperCase();
  
  // Check for exact match
  const exactMatch = colorNames.find(color => color.hex === normalizedHex);
  if (exactMatch) {
    return exactMatch.name;
  }
  
  // Find closest color
  let closestColor = colorNames[0];
  let minDifference = colorDifference(normalizedHex, closestColor.hex);
  
  for (let i = 1; i < colorNames.length; i++) {
    const diff = colorDifference(normalizedHex, colorNames[i].hex);
    if (diff < minDifference) {
      minDifference = diff;
      closestColor = colorNames[i];
    }
  }
  
  return closestColor.name;
};

/**
 * Get color name with shade information (light/dark/medium)
 */
export const getDetailedColorName = (hex: string): string => {
  const baseName = getColorName(hex);
  
  // Calculate brightness
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Weighted brightness formula (perceived brightness)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Determine shade
  let shade = '';
  if (brightness < 85) {
    shade = 'Dark ';
  } else if (brightness > 170) {
    shade = 'Light ';
  } else {
    shade = 'Medium ';
  }
  
  // Don't add shade to black, white, or grayscale colors
  if (['Black', 'White', 'Gray', 'Silver'].includes(baseName)) {
    return baseName;
  }
  
  return shade + baseName;
};
/**
 * Storage utility functions for Prism color palette generator
 */

// Local storage keys
const SAVED_PALETTES_KEY = 'prism_saved_palettes';
const PALETTE_HISTORY_KEY = 'prism_palette_history';

// Types
export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: string;
}

/**
 * Saves a palette to local storage
 */
export const savePalette = (name: string, colors: string[]): SavedPalette => {
  const savedPalettes = getSavedPalettes();
  
  const newPalette: SavedPalette = {
    id: generateId(),
    name,
    colors,
    createdAt: new Date().toISOString(),
  };
  
  savedPalettes.push(newPalette);
  localStorage.setItem(SAVED_PALETTES_KEY, JSON.stringify(savedPalettes));
  
  return newPalette;
};

/**
 * Gets all saved palettes from local storage
 */
export const getSavedPalettes = (): SavedPalette[] => {
  const palettesJson = localStorage.getItem(SAVED_PALETTES_KEY);
  return palettesJson ? JSON.parse(palettesJson) : [];
};

/**
 * Deletes a palette from local storage
 */
export const deletePalette = (id: string): void => {
  const savedPalettes = getSavedPalettes();
  const updatedPalettes = savedPalettes.filter(palette => palette.id !== id);
  localStorage.setItem(SAVED_PALETTES_KEY, JSON.stringify(updatedPalettes));
};

/**
 * Updates a palette in local storage
 */
export const updatePalette = (id: string, updates: Partial<Omit<SavedPalette, 'id' | 'createdAt'>>): SavedPalette | null => {
  const savedPalettes = getSavedPalettes();
  const paletteIndex = savedPalettes.findIndex(palette => palette.id === id);
  
  if (paletteIndex === -1) return null;
  
  const updatedPalette = {
    ...savedPalettes[paletteIndex],
    ...updates,
  };
  
  savedPalettes[paletteIndex] = updatedPalette;
  localStorage.setItem(SAVED_PALETTES_KEY, JSON.stringify(savedPalettes));
  
  return updatedPalette;
};

/**
 * Saves palette history to local storage
 */
export const savePaletteHistory = (palettes: string[][]): void => {
  localStorage.setItem(PALETTE_HISTORY_KEY, JSON.stringify(palettes));
};

/**
 * Gets palette history from local storage
 */
export const getPaletteHistory = (): string[][] => {
  const historyJson = localStorage.getItem(PALETTE_HISTORY_KEY);
  return historyJson ? JSON.parse(historyJson) : [];
};

/**
 * Generates a unique ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
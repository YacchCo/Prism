import React, { useState } from 'react';
import { getDetailedColorName } from '@/utils/colorNameUtils';
import { hexToRgb, hexToHsl, hslToHex, getContrastRatio, isAccessible, formatColorsForExport } from '@/utils/colorUtils';

interface ColorPaletteProps {
    colors: string[];
    mini?: boolean;
    onColorSelect?: (color: string) => void;
    onColorClick?: (color: string) => void;
    allowAdjustments?: boolean;
    allowComparison?: boolean;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, mini = false, onColorClick, allowAdjustments = false, allowComparison = false }) => {
    const [hoveredColor, setHoveredColor] = useState<string | null>(null);
    const [adjustedColors, setAdjustedColors] = useState<string[]>(colors);
    const [showAdjustments, setShowAdjustments] = useState<number | null>(null);
    const [compareColors, setCompareColors] = useState<{ first: string | null, second: string | null }>({ first: null, second: null });
    const [showComparison, setShowComparison] = useState<boolean>(false);

    // Update adjusted colors when input colors change
    React.useEffect(() => {
        setAdjustedColors(colors);
    }, [colors]);
    // Function to determine if text should be light or dark based on background color
    const getContrastColor = (hexColor: string): string => {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);

        // Calculate luminance - a measure of brightness
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Return white for dark colors, black for light colors
        return luminance > 0.5 ? '#000000' : '#ffffff';
    };

    // Function to adjust color brightness and saturation
    const adjustColor = (index: number, property: 'brightness' | 'saturation', value: number) => {
        const color = adjustedColors[index];
        const hsl = hexToHsl(color);

        if (property === 'brightness') {
            // Adjust lightness (brightness)
            hsl.l = Math.max(0, Math.min(100, hsl.l + value));
        } else {
            // Adjust saturation
            hsl.s = Math.max(0, Math.min(100, hsl.s + value));
        }

        const newColor = hslToHex(hsl.h, hsl.s, hsl.l);
        const newColors = [...adjustedColors];
        newColors[index] = newColor;
        setAdjustedColors(newColors);
    };

    // Handle color selection for comparison
    const handleColorCompare = (color: string) => {
        if (!compareColors.first) {
            setCompareColors({ ...compareColors, first: color });
        } else if (!compareColors.second) {
            setCompareColors({ ...compareColors, second: color });
            setShowComparison(true);
        } else {
            // Reset and start over
            setCompareColors({ first: color, second: null });
            setShowComparison(false);
        }
    };

    // Reset color comparison
    const resetComparison = () => {
        setCompareColors({ first: null, second: null });
        setShowComparison(false);
    };

    return (
        <div className="space-y-4">
            {/* Color comparison UI */}
            {allowComparison && (
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <button
                            className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                            onClick={resetComparison}
                        >
                            Reset Comparison
                        </button>
                        <span className="text-sm">
                            {!compareColors.first ?
                                'Select first color' :
                                !compareColors.second ?
                                    'Select second color' :
                                    'Comparing colors'}
                        </span>
                    </div>

                    {showComparison && compareColors.first && compareColors.second && (
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-md mb-4">
                            <div className="flex items-center mb-3">
                                <div
                                    className="w-10 h-10 rounded-md mr-2"
                                    style={{ backgroundColor: compareColors.first }}
                                ></div>
                                <div className="font-mono text-sm">{compareColors.first}</div>
                                <div className="mx-2">vs</div>
                                <div
                                    className="w-10 h-10 rounded-md mr-2"
                                    style={{ backgroundColor: compareColors.second }}
                                ></div>
                                <div className="font-mono text-sm">{compareColors.second}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Contrast Ratio</h4>
                                    <div className="text-lg font-bold">
                                        {getContrastRatio(compareColors.first, compareColors.second).toFixed(2)}:1
                                    </div>
                                    <div className="mt-1 text-xs">
                                        {isAccessible(compareColors.first, compareColors.second, 'AA') ?
                                            <span className="text-green-500">Passes WCAG AA ✓</span> :
                                            <span className="text-red-500">Fails WCAG AA ✗</span>
                                        }
                                    </div>
                                    <div className="text-xs">
                                        {isAccessible(compareColors.first, compareColors.second, 'AAA') ?
                                            <span className="text-green-500">Passes WCAG AAA ✓</span> :
                                            <span className="text-red-500">Fails WCAG AAA ✗</span>
                                        }
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Sample Text</h4>
                                    <div className="p-2 rounded" style={{ backgroundColor: compareColors.second, color: compareColors.first }}>
                                        <div className="font-semibold">Foreground on Background</div>
                                        <div className="text-xs">Small text example</div>
                                    </div>
                                    <div className="p-2 rounded mt-2" style={{ backgroundColor: compareColors.first, color: compareColors.second }}>
                                        <div className="font-semibold">Background on Foreground</div>
                                        <div className="text-xs">Small text example</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className={`grid grid-cols-${mini ? '5' : '1'} md:grid-cols-5 gap-2 w-full`}>
                {adjustedColors.map((color, index) => (
                    <div
                        key={index}
                        className={`${mini ? 'h-8' : 'h-24 md:h-32'} rounded-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer relative group`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                            if (onColorClick) {
                                onColorClick(color);
                            } else if (allowComparison) {
                                handleColorCompare(color);
                            } else if (allowAdjustments && !mini) {
                                setShowAdjustments(showAdjustments === index ? null : index);
                            } else {
                                navigator.clipboard.writeText(color);
                                // Replace alert with a more elegant notification
                                const notification = document.createElement('div');
                                notification.textContent = `Copied ${color} to clipboard!`;
                                notification.className = 'fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50';
                                document.body.appendChild(notification);
                                setTimeout(() => {
                                    notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                                    setTimeout(() => document.body.removeChild(notification), 500);
                                }, 2000);
                            }
                        }}
                        onMouseEnter={() => setHoveredColor(color)}
                        onMouseLeave={() => setHoveredColor(null)}
                    >
                        <div className="flex flex-col items-center">
                            <span
                                className={`font-mono ${mini ? 'text-xs' : 'text-lg'} font-semibold`}
                                style={{ color: getContrastColor(color) }}
                            >
                                {color.toUpperCase()}
                            </span>
                            {!mini && (
                                <span
                                    className="text-xs mt-1 opacity-80"
                                    style={{ color: getContrastColor(color) }}
                                >
                                    {getDetailedColorName(color)}
                                </span>
                            )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 rounded-md transition-opacity">
                            <span className="text-white text-sm">
                                {onColorClick ? 'Click to select' : 'Click to copy'}
                            </span>
                        </div>

                        {/* Color information tooltip */}
                        {hoveredColor === color && !mini && (
                            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg z-10 w-48 text-xs">
                                <div className="font-semibold mb-1">Color Information:</div>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                    <span className="text-gray-600 dark:text-gray-400">RGB:</span>
                                    <span>
                                        {(() => {
                                            const rgb = hexToRgb(color);
                                            return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
                                        })()}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">HSL:</span>
                                    <span>
                                        {(() => {
                                            const hsl = hexToHsl(color);
                                            return `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
                                        })()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Color adjustment controls */}
                        {showAdjustments === index && allowAdjustments && !mini && (
                            <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg z-10 w-64">
                                <div className="font-semibold mb-2">Adjust Color</div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Brightness</label>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    adjustColor(index, 'brightness', -5);
                                                }}
                                            >-</button>
                                            <div className="flex-grow h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${hexToHsl(color).l}%` }}></div>
                                            </div>
                                            <button
                                                className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    adjustColor(index, 'brightness', 5);
                                                }}
                                            >+</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Saturation</label>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    adjustColor(index, 'saturation', -5);
                                                }}
                                            >-</button>
                                            <div className="flex-grow h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${hexToHsl(color).s}%` }}></div>
                                            </div>
                                            <button
                                                className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    adjustColor(index, 'saturation', 5);
                                                }}
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <button
                                            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newColors = [...adjustedColors];
                                                newColors[index] = colors[index];
                                                setAdjustedColors(newColors);
                                            }}
                                        >Reset</button>
                                        <button
                                            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(color);
                                                setShowAdjustments(null);
                                                // Show notification
                                                const notification = document.createElement('div');
                                                notification.textContent = `Copied ${color} to clipboard!`;
                                                notification.className = 'fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50';
                                                document.body.appendChild(notification);
                                                setTimeout(() => {
                                                    notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                                                    setTimeout(() => document.body.removeChild(notification), 500);
                                                }, 2000);
                                            }}
                                        >Copy & Close</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ColorPalette;
import React from 'react';

interface ColorPaletteProps {
    colors: string[];
    mini?: boolean;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, mini = false }) => {
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

    return (
        <div className={`grid grid-cols-${mini ? '5' : '1'} md:grid-cols-5 gap-2 w-full`}>
            {colors.map((color, index) => (
                <div
                    key={index}
                    className={`${mini ? 'h-8' : 'h-24 md:h-32'} rounded-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer relative group`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                        navigator.clipboard.writeText(color);
                        alert(`Copied ${color} to clipboard!`);
                    }}
                >
                    <span
                        className={`font-mono ${mini ? 'text-xs' : 'text-lg'} font-semibold`}
                        style={{ color: getContrastColor(color) }}
                    >
                        {color.toUpperCase()}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 rounded-md transition-opacity">
                        <span className="text-white text-sm">Click to copy</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ColorPalette;
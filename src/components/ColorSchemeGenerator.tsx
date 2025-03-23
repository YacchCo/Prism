import React, { useState } from 'react';
import ColorPalette from './ColorPalette';
import {
    getComplementaryColor,
    getAnalogousColors,
    getTriadicColors,
    getTetradicColors,
    getMonochromaticColors
} from '@/utils/colorUtils';

type SchemeType = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic';

interface ColorSchemeGeneratorProps {
    baseColor: string;
    onSelectScheme?: (colors: string[]) => void;
}

const ColorSchemeGenerator: React.FC<ColorSchemeGeneratorProps> = ({
    baseColor,
    onSelectScheme
}) => {
    const [selectedScheme, setSelectedScheme] = useState<SchemeType>('complementary');

    const generateScheme = (type: SchemeType): string[] => {
        switch (type) {
            case 'complementary':
                return [baseColor, getComplementaryColor(baseColor)];
            case 'analogous':
                return getAnalogousColors(baseColor, 2);
            case 'triadic':
                return getTriadicColors(baseColor);
            case 'tetradic':
                return getTetradicColors(baseColor);
            case 'monochromatic':
                return getMonochromaticColors(baseColor);
            default:
                return [baseColor];
        }
    };

    const schemes = [
        { type: 'complementary', label: 'Complementary' },
        { type: 'analogous', label: 'Analogous' },
        { type: 'triadic', label: 'Triadic' },
        { type: 'tetradic', label: 'Tetradic' },
        { type: 'monochromatic', label: 'Monochromatic' },
    ];

    const handleSchemeChange = (type: SchemeType) => {
        setSelectedScheme(type);
    };

    const handleSelectScheme = () => {
        if (onSelectScheme) {
            onSelectScheme(generateScheme(selectedScheme));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {schemes.map(scheme => (
                    <button
                        key={scheme.type}
                        className={`btn ${selectedScheme === scheme.type ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        onClick={() => handleSchemeChange(scheme.type as SchemeType)}
                    >
                        {scheme.label}
                    </button>
                ))}
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-3">{schemes.find(s => s.type === selectedScheme)?.label} Scheme</h3>
                <ColorPalette colors={generateScheme(selectedScheme)} />
                <div className="mt-4">
                    <button
                        className="btn btn-primary"
                        onClick={handleSelectScheme}
                    >
                        Use This Scheme
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ColorSchemeGenerator;
import React, { useState } from 'react';
import { getContrastRatio, isAccessible } from '@/utils/colorUtils';

interface AccessibilityCheckerProps {
    colors: string[];
}

const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({ colors }) => {
    const [foregroundColor, setForegroundColor] = useState(colors[0] || '#000000');
    const [backgroundColor, setBackgroundColor] = useState(colors[1] || '#ffffff');
    const [selectedLevel, setSelectedLevel] = useState<'AA' | 'AAA'>('AA');

    const contrastRatio = getContrastRatio(foregroundColor, backgroundColor);
    const passes = isAccessible(foregroundColor, backgroundColor, selectedLevel);

    const getContrastRatioText = () => {
        return contrastRatio.toFixed(2) + ':1';
    };

    const getContrastRatingClass = () => {
        if (contrastRatio >= 7) return 'text-green-600 dark:text-green-400';
        if (contrastRatio >= 4.5) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const handleSelectColor = (color: string, type: 'foreground' | 'background') => {
        if (type === 'foreground') {
            setForegroundColor(color);
        } else {
            setBackgroundColor(color);
        }
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h3 className="text-lg font-semibold mb-3">Color Accessibility Checker</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Check if your color combinations meet WCAG accessibility standards.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Foreground Color</label>
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-10 h-10 rounded-md border border-gray-300"
                                style={{ backgroundColor: foregroundColor }}
                            />
                            <input
                                type="text"
                                value={foregroundColor}
                                onChange={(e) => setForegroundColor(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium mb-1">Select from palette:</label>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color, index) => (
                                    <button
                                        key={index}
                                        className="w-8 h-8 rounded-md border border-gray-300 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleSelectColor(color, 'foreground')}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-10 h-10 rounded-md border border-gray-300"
                                style={{ backgroundColor: backgroundColor }}
                            />
                            <input
                                type="text"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-sm font-medium mb-1">Select from palette:</label>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color, index) => (
                                    <button
                                        key={index}
                                        className="w-8 h-8 rounded-md border border-gray-300 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleSelectColor(color, 'background')}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">WCAG Level</label>
                    <div className="flex space-x-2">
                        <button
                            className={`btn ${selectedLevel === 'AA' ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                            onClick={() => setSelectedLevel('AA')}
                        >
                            AA (4.5:1)
                        </button>
                        <button
                            className={`btn ${selectedLevel === 'AAA' ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                            onClick={() => setSelectedLevel('AAA')}
                        >
                            AAA (7:1)
                        </button>
                    </div>
                </div>

                <div className="p-4 rounded-md" style={{ backgroundColor, color: foregroundColor }}>
                    <h4 className="text-lg font-semibold mb-2">Sample Text</h4>
                    <p>This is how your text will look with these colors.</p>
                    <p className="text-sm mt-1">This is smaller text that might be used for captions or notes.</p>
                </div>

                <div className="mt-6 p-4 rounded-md border border-gray-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold">Contrast Ratio</h4>
                            <p className={`text-xl font-bold ${getContrastRatingClass()}`}>
                                {getContrastRatioText()}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold">WCAG {selectedLevel}</h4>
                            <p className={passes ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                {passes ? 'Pass ✓' : 'Fail ✗'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                            <strong>WCAG AA:</strong> Requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
                        </p>
                        <p className="mt-1">
                            <strong>WCAG AAA:</strong> Requires a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityChecker;
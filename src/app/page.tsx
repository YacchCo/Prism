'use client';

import { useState, useEffect } from 'react';
import ColorPalette from '@/components/ColorPalette';
import ColorSchemeGenerator from '@/components/ColorSchemeGenerator';
import SavePaletteForm from '@/components/SavePaletteForm';
import SavedPalettes from '@/components/SavedPalettes';
import PaletteExporter from '@/components/PaletteExporter';
import AccessibilityChecker from '@/components/AccessibilityChecker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateRandomPalette } from '@/utils/colorUtils';
import { savePaletteHistory, getPaletteHistory } from '@/utils/storageUtils';

export default function Home() {
    const [palette, setPalette] = useState<string[]>([]);
    const [paletteHistory, setPaletteHistory] = useState<string[][]>([]);
    const [selectedTab, setSelectedTab] = useState<'generate' | 'schemes' | 'saved' | 'export' | 'accessibility'>('generate');
    const [selectedColor, setSelectedColor] = useState<string>('');

    // Generate a new palette with 5 colors
    const generatePalette = () => {
        const newPalette = generateRandomPalette(5);
        setPalette(newPalette);
        const updatedHistory = [...paletteHistory, newPalette].slice(-5); // Keep last 5 palettes
        setPaletteHistory(updatedHistory);
        savePaletteHistory(updatedHistory);
    };

    // Load palette history from local storage on initial load
    useEffect(() => {
        const savedHistory = getPaletteHistory();
        if (savedHistory.length > 0) {
            setPaletteHistory(savedHistory);
            setPalette(savedHistory[savedHistory.length - 1]);
        } else {
            generatePalette();
        }
    }, []);

    // Handle selecting a color for scheme generation or accessibility checking
    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        setSelectedTab('schemes');
    };

    // Handle selecting a palette from history or saved palettes
    const handleSelectPalette = (colors: string[]) => {
        setPalette(colors);
        setSelectedTab('generate');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex-grow container mx-auto px-4 py-8">
                <section className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Prism Color Palette Generator</h1>
                    <p className="text-xl mb-6">Create beautiful color combinations for your next project</p>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <button
                            onClick={() => setSelectedTab('generate')}
                            className={`btn ${selectedTab === 'generate' ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            Generate
                        </button>
                        <button
                            onClick={() => setSelectedTab('schemes')}
                            className={`btn ${selectedTab === 'schemes' ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                            disabled={!palette.length}
                        >
                            Color Schemes
                        </button>
                        <button
                            onClick={() => setSelectedTab('saved')}
                            className={`btn ${selectedTab === 'saved' ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            Saved Palettes
                        </button>
                        <button
                            onClick={() => setSelectedTab('export')}
                            className={`btn ${selectedTab === 'export' ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                            disabled={!palette.length}
                        >
                            Export
                        </button>
                        <button
                            onClick={() => setSelectedTab('accessibility')}
                            className={`btn ${selectedTab === 'accessibility' ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                            disabled={!palette.length}
                        >
                            Accessibility
                        </button>
                    </div>
                </section>
            </div>

            <div className="flex-grow container mx-auto px-4 py-8">
                {selectedTab === 'generate' && (
                    <div className="space-y-12">
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-4">Current Palette</h2>
                            <ColorPalette colors={palette} onColorSelect={handleColorSelect} />
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={generatePalette}
                                    className="btn btn-primary flex-grow"
                                >
                                    Generate New Palette
                                </button>
                            </div>
                        </div>

                        {paletteHistory.length > 0 && (
                            <div className="card p-6">
                                <h2 className="text-2xl font-bold mb-4">Recent Palettes</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paletteHistory.slice().reverse().map((colors, index) => (
                                        <div key={index} className="card">
                                            <ColorPalette colors={colors} mini />
                                            <button
                                                onClick={() => handleSelectPalette(colors)}
                                                className="btn btn-secondary w-full mt-2"
                                            >
                                                Select
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {selectedTab === 'schemes' && (
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold mb-4">Color Schemes</h2>
                        <ColorSchemeGenerator baseColor={selectedColor} />
                    </div>
                )}

                {selectedTab === 'saved' && (
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold mb-4">Saved Palettes</h2>
                        <SavedPalettes onSelect={handleSelectPalette} />
                    </div>
                )}

                {selectedTab === 'export' && (
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold mb-4">Export Palette</h2>
                        <PaletteExporter colors={palette} />
                    </div>
                )}

                {selectedTab === 'accessibility' && (
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold mb-4">Accessibility Check</h2>
                        <AccessibilityChecker colors={palette} />
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
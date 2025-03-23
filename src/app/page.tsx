'use client';

import { useState, useEffect } from 'react';
import ColorPalette from '@/components/ColorPalette';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
    const [palette, setPalette] = useState<string[]>([]);
    const [paletteHistory, setPaletteHistory] = useState<string[][]>([]);

    // Generate a random color in hex format
    const generateRandomColor = (): string => {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    };

    // Generate a new palette with 5 colors
    const generatePalette = () => {
        const newPalette = Array.from({ length: 5 }, () => generateRandomColor());
        setPalette(newPalette);
        setPaletteHistory(prev => [...prev, newPalette].slice(-5)); // Keep last 5 palettes
    };

    // Generate a palette on initial load
    useEffect(() => {
        generatePalette();
    }, []);

    return (
        <main className="min-h-screen flex flex-col">
            <Header />

            <div className="flex-grow container mx-auto px-4 py-8">
                <section className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Prism Color Palette Generator</h1>
                    <p className="text-xl mb-6">Create beautiful color combinations for your next project</p>
                    <button
                        onClick={generatePalette}
                        className="btn btn-primary"
                    >
                        Generate New Palette
                    </button>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Current Palette</h2>
                    <ColorPalette colors={palette} />
                </section>

                {paletteHistory.length > 1 && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Recent Palettes</h2>
                        <div className="space-y-4">
                            {paletteHistory.slice(0, -1).reverse().map((colors, index) => (
                                <div key={index} className="card">
                                    <ColorPalette colors={colors} mini />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </main>
    );
}
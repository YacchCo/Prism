import React, { useState } from 'react';
import { savePalette } from '@/utils/storageUtils';

interface SavePaletteFormProps {
    colors: string[];
    onSave?: () => void;
}

const SavePaletteForm: React.FC<SavePaletteFormProps> = ({ colors, onSave }) => {
    const [paletteName, setPaletteName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!paletteName.trim()) {
            setMessage({ text: 'Please enter a name for your palette', type: 'error' });
            return;
        }

        setIsSaving(true);

        try {
            savePalette(paletteName.trim(), colors);
            setPaletteName('');
            setMessage({ text: 'Palette saved successfully!', type: 'success' });

            if (onSave) {
                onSave();
            }
        } catch (error) {
            setMessage({ text: 'Failed to save palette', type: 'error' });
            console.error('Error saving palette:', error);
        } finally {
            setIsSaving(false);

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        }
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-3">Save Current Palette</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="palette-name" className="block text-sm font-medium mb-1">
                        Palette Name
                    </label>
                    <input
                        id="palette-name"
                        type="text"
                        value={paletteName}
                        onChange={(e) => setPaletteName(e.target.value)}
                        placeholder="Enter a name for this palette"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isSaving}
                    />
                </div>

                {message && (
                    <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Palette'}
                </button>
            </form>
        </div>
    );
};

export default SavePaletteForm;
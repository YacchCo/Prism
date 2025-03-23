import React, { useState, useEffect } from 'react';
import ColorPalette from './ColorPalette';
import { SavedPalette, getSavedPalettes, deletePalette, updatePalette } from '@/utils/storageUtils';

interface SavedPalettesProps {
    onSelectPalette?: (colors: string[]) => void;
}

const SavedPalettes: React.FC<SavedPalettesProps> = ({ onSelectPalette }) => {
    const [palettes, setPalettes] = useState<SavedPalette[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    // Load saved palettes on component mount
    useEffect(() => {
        setPalettes(getSavedPalettes());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this palette?')) {
            deletePalette(id);
            setPalettes(getSavedPalettes());
        }
    };

    const handleEdit = (palette: SavedPalette) => {
        setEditingId(palette.id);
        setEditName(palette.name);
    };

    const handleSaveEdit = (id: string) => {
        if (editName.trim()) {
            updatePalette(id, { name: editName.trim() });
            setPalettes(getSavedPalettes());
            setEditingId(null);
            setEditName('');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleSelect = (colors: string[]) => {
        if (onSelectPalette) {
            onSelectPalette(colors);
        }
    };

    if (palettes.length === 0) {
        return (
            <div className="card p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No saved palettes yet.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Generate a palette you like and save it to see it here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {palettes.map(palette => (
                <div key={palette.id} className="card">
                    <div className="flex justify-between items-center mb-4">
                        {editingId === palette.id ? (
                            <div className="flex-1 flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Palette name"
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleSaveEdit(palette.id)}
                                    className="btn btn-primary"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="btn bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <h3 className="text-lg font-semibold">{palette.name}</h3>
                        )}

                        {editingId !== palette.id && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(palette)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(palette.id)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    <ColorPalette colors={palette.colors} mini />

                    <div className="mt-4">
                        <button
                            onClick={() => handleSelect(palette.colors)}
                            className="btn btn-primary"
                        >
                            Use This Palette
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SavedPalettes;
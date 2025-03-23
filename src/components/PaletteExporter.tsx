import React, { useState } from 'react';
import { formatColorsForExport } from '@/utils/colorUtils';

type ExportFormat = 'css' | 'scss' | 'json';

interface PaletteExporterProps {
    colors: string[];
}

const PaletteExporter: React.FC<PaletteExporterProps> = ({ colors }) => {
    const [format, setFormat] = useState<ExportFormat>('css');
    const [copied, setCopied] = useState(false);

    const exportFormats = [
        { value: 'css', label: 'CSS Variables' },
        { value: 'scss', label: 'SCSS Variables' },
        { value: 'json', label: 'JSON' },
    ];

    const handleFormatChange = (newFormat: ExportFormat) => {
        setFormat(newFormat);
        setCopied(false);
    };

    const handleCopyToClipboard = () => {
        const formattedColors = formatColorsForExport(colors, format);
        navigator.clipboard.writeText(formattedColors);
        setCopied(true);

        // Reset copied state after 3 seconds
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    const getExportPreview = () => {
        return formatColorsForExport(colors, format);
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-3">Export Palette</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Format</label>
                <div className="flex flex-wrap gap-2">
                    {exportFormats.map((exportFormat) => (
                        <button
                            key={exportFormat.value}
                            className={`btn ${format === exportFormat.value ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                            onClick={() => handleFormatChange(exportFormat.value as ExportFormat)}
                        >
                            {exportFormat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Preview</label>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-sm">
                    {getExportPreview()}
                </pre>
            </div>

            <button
                className={`btn w-full ${copied ? 'bg-green-500 hover:bg-green-600' : 'btn-primary'}`}
                onClick={handleCopyToClipboard}
            >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
        </div>
    );
};

export default PaletteExporter;
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-md"></div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Prism</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Create beautiful color palettes for your projects
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © {new Date().getFullYear()} YacchCo. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Made with ❤️ using Next.js
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
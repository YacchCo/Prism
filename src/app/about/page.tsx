import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />

            <div className="flex-grow container mx-auto px-4 py-8">
                <section className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">About Prism</h1>
                    <p className="text-xl mb-6">A modern color palette generator for designers and developers</p>

                    <div className="card mb-8">
                        <h2 className="text-2xl font-semibold mb-4">What is Prism?</h2>
                        <p className="mb-4">
                            Prism is a powerful color palette generator designed to help designers and developers create beautiful color combinations for their projects.
                            Whether you're working on a website, mobile app, or any other digital product, Prism can help you find the perfect colors.
                        </p>
                        <p>
                            Built with Next.js and deployed on Google Cloud Run, Prism is fast, reliable, and easy to use.
                        </p>
                    </div>

                    <div className="card mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Features</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Generate random color palettes with a single click</li>
                            <li>View your recently generated palettes</li>
                            <li>Copy color codes to clipboard</li>
                            <li>Responsive design that works on all devices</li>
                            <li>Dark mode support</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Next.js - React framework for server-rendered applications</li>
                            <li>TypeScript - For type safety and better developer experience</li>
                            <li>TailwindCSS - Utility-first CSS framework</li>
                            <li>Google Cloud Run - Serverless container platform</li>
                        </ul>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
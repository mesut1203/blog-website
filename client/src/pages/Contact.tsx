import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Quote as QuoteIcon } from 'lucide-react';
import { getQuotes } from '../lib/api';
import type { Quote } from '../types';

export default function Contact() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        async function fetchQuotes() {
            try {
                const data = await getQuotes();
                setQuotes(data);
            } catch (error) {
                console.error('Error fetching quotes:', error);
            }
        }
        fetchQuotes();
    }, []);

    useEffect(() => {
        if (quotes.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 5000); // Change quote every 5 seconds

        return () => clearInterval(interval);
    }, [quotes]);

    return (
        <div className="min-h-screen bg-emerald-50/30">
            {/* Hero Section */}
            <div className="relative pt-40 pb-32 px-6 md:px-12 overflow-hidden bg-emerald-950">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000&auto=format&fit=crop"
                        alt="Contact Us Background"
                        className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-emerald-900/20"></div>
                </div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-sm mb-6 block">We're Here For You</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Touch</span>
                    </h1>
                    <p className="text-xl text-emerald-100/90 leading-relaxed font-medium">
                        Whether you have a question about our thoughts, or just want to say hi, our team is ready to listen.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-20 -mt-16 relative z-20">

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Contact Information */}
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-emerald-900/5 border border-white/50">
                        <h2 className="text-2xl font-bold text-emerald-950 mb-8">Contact Information</h2>

                        <div className="space-y-6 text-lg">
                            <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-emerald-50/50 transition-colors">
                                <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600 shrink-0">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-950">Email</h3>
                                    <p className="text-emerald-700/80 mt-1">contact@soultrees.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-emerald-50/50 transition-colors">
                                <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600 shrink-0">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-950">Phone</h3>
                                    <p className="text-emerald-700/80 mt-1">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-emerald-50/50 transition-colors">
                                <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600 shrink-0">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-950">Office</h3>
                                    <p className="text-emerald-700/80 mt-1">123 Nature Trail</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Animated Quotes Section */}
                    <div className="h-full min-h-[400px] flex items-center justify-center relative bg-emerald-900 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-800/50 rounded-full blur-3xl -ml-32 -mb-32"></div>

                        <QuoteIcon className="absolute top-8 left-8 w-24 h-24 text-emerald-800/30 rotate-180" />

                        <div className="relative z-10 w-full text-center">
                            {quotes.length > 0 ? (
                                <div className="relative h-48 flex items-center justify-center">
                                    {quotes.map((quote, index) => (
                                        <div
                                            key={quote.id}
                                            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${index === currentQuoteIndex
                                                ? 'opacity-100 translate-y-0 scale-100'
                                                : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                                                }`}
                                        >
                                            <p className="text-2xl md:text-3xl font-medium text-emerald-50 leading-relaxed italic mb-6">
                                                "{quote.content}"
                                            </p>
                                            <div className="w-12 h-1 bg-emerald-500/50 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="h-8 bg-emerald-800/50 rounded-full w-3/4 mb-4"></div>
                                    <div className="h-4 bg-emerald-800/50 rounded-full w-1/2"></div>
                                </div>
                            )}

                            {/* Pagination Dots */}
                            {quotes.length > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {quotes.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentQuoteIndex(idx)}
                                            className={`h-2 rounded-full transition-all duration-500 ${idx === currentQuoteIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-emerald-800 hover:bg-emerald-600'
                                                }`}
                                            aria-label={`Go to quote ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

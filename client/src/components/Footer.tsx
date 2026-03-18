import { Leaf, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="mt-auto relative bg-emerald-950 pt-20 pb-10 overflow-hidden border-t border-emerald-900/50">
        {/* Decorative ambient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-800/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                
                {/* Brand & Intro */}
                <div className="md:col-span-12 lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-900/50">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <span className="font-extrabold text-3xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
                            SoulTrees
                        </span>
                    </div>
                    <p className="text-emerald-100/70 text-lg leading-relaxed max-w-md font-medium">
                        Cultivating mindful thoughts and sharing ideas in the digital landscape. Let's grow something beautiful together.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-4">
                        {[
                            { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                            { Icon: Github, href: 'https://github.com', label: 'Github' },
                            { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                            { Icon: Mail, href: 'mailto:contact@soultrees.com', label: 'Email' }
                        ].map((item, i) => (
                            <a
                                key={i}
                                href={item.href}
                                aria-label={item.label}
                                className="group w-12 h-12 rounded-2xl bg-emerald-900/50 border border-emerald-800/80 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-900 hover:border-emerald-500"
                            >
                                <item.Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Spacer */}
                <div className="hidden lg:block lg:col-span-3"></div>

                {/* Quick Links */}
                <div className="md:col-span-12 lg:col-span-4">
                    <h3 className="text-sm font-bold text-emerald-100 tracking-[0.2em] uppercase mb-8 flex items-center gap-4">
                        Explore <span className="h-px bg-emerald-800/80 flex-1"></span>
                    </h3>
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-4 font-medium">
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'Blog', path: '/blog' },
                            { name: 'Contact', path: '/contact' }
                        ].map((link, idx) => (
                            <li key={idx}>
                                <Link 
                                    to={link.path} 
                                    className="group flex items-center gap-2 text-emerald-100/70 hover:text-emerald-300 transition-colors py-1"
                                >
                                    <span className="w-4 h-px bg-emerald-800 group-hover:bg-emerald-400 group-hover:w-6 transition-all duration-300"></span>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 mt-8 border-t border-emerald-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-emerald-500/80 text-sm font-medium">
                    © {new Date().getFullYear()} SoulTrees. All rights reserved.
                </p>
                
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400/80 bg-emerald-900/30 px-5 py-2.5 rounded-full border border-emerald-800/30">
                    <span>Made by</span>
                    <span className="text-emerald-300">Decode Vu</span>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;

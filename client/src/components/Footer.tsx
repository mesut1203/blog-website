import { Leaf, Twitter, Github, Linkedin, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="mt-auto border-t border-emerald-200 bg-emerald-950 text-emerald-50 py-12 px-6 lg:rounded-t-[2.5rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-3xl -mr-64 -mt-64 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/40 rounded-full blur-3xl -ml-64 -mb-64 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

                {/* Brand Section */}
                <div className="md:col-span-1 lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-800 p-2.5 rounded-xl text-emerald-300 shadow-lg shadow-emerald-900/50">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-3xl tracking-tight text-white">SoulTrees</span>
                    </div>
                    <p className="text-emerald-300/80 text-lg leading-relaxed max-w-sm">
                        Cultivating mindful thoughts and sharing ideas in the digital landscape. Let's grow something beautiful together.
                    </p>
                    <div className="flex gap-4 pt-2">
                        {[
                            { Icon: Twitter, href: '#', label: 'Twitter' },
                            { Icon: Github, href: '#', label: 'Github' },
                            { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                            { Icon: Mail, href: 'mailto:contact@soultrees.com', label: 'Email' }
                        ].map((item, i) => (
                            <a
                                key={i}
                                href={item.href}
                                aria-label={item.label}
                                className="w-11 h-11 rounded-full bg-emerald-900/80 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20"
                            >
                                <item.Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="md:col-span-1 lg:col-span-4 lg:col-start-9 space-y-6">
                    <h3 className="text-lg font-bold text-white tracking-wide uppercase">Explore</h3>
                    <ul className="space-y-4 text-emerald-300/80 font-medium">
                        <li><Link to="/" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Home</Link></li>
                        <li><Link to="/blog" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Blog</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Contact</Link></li>
                        <li><Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Dashboard</Link></li>
                    </ul>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-emerald-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-emerald-400/60 text-sm font-medium">
                <p>© {new Date().getFullYear()} SoulTrees. All rights reserved.</p>
                <p className="flex items-center gap-1.5">
                    Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> by SoulTrees Team
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;

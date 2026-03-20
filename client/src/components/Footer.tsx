import { Leaf, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="mt-auto relative bg-emerald-950 border-t border-emerald-900/50">
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* Brand & Links */}
            <div className="flex flex-col items-center md:items-start gap-6">
                <div className="flex items-center gap-2.5">
                    <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-1.5 rounded-lg text-white shadow-md shadow-emerald-900/50">
                        <Leaf className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
                        SoulTrees
                    </span>
                </div>
                
                {/* Navigation Links inline */}
                <ul className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Blog', path: '/blog' },
                        { name: 'Contact', path: '/contact' }
                    ].map((link, idx) => (
                        <li key={idx}>
                            <Link 
                                to={link.path} 
                                className="text-emerald-100/70 hover:text-emerald-300 transition-colors uppercase tracking-wider text-xs"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Social Links & Copyright */}
            <div className="flex flex-col items-center md:items-end gap-6">
                <div className="flex items-center gap-3">
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
                            className="w-9 h-9 rounded-full bg-emerald-900/50 border border-emerald-800/80 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all hover:-translate-y-0.5"
                        >
                            <item.Icon className="w-4 h-4" />
                        </a>
                    ))}
                </div>
            </div>
        </div>

        {/* Bottom Bar strictly one line */}
        <div className="w-full bg-emerald-950/50 border-t border-emerald-900/80">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-medium text-emerald-500/70">
                <p>© {new Date().getFullYear()} SoulTrees. All rights reserved.</p>
                <div className="flex items-center gap-1.5">
                    <span>Made by</span>
                    <span className="text-emerald-400 font-bold">Decode Vu</span>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;

import { Leaf, Send, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => (
    <footer className="mt-32 border-t border-emerald-200 bg-emerald-950 text-emerald-50 py-20 px-6 rounded-t-[3rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">

            {/* Contact Info & Socials */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-800 p-2.5 rounded-xl text-emerald-300">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-3xl tracking-tight text-white">SoulTrees</span>
                </div>
                <p className="text-emerald-300/80 max-w-sm text-lg leading-relaxed">
                    Cultivating thoughts and ideas in the digital landscape. Let's grow something beautiful together.
                </p>

                <div className="flex gap-4 pt-4">
                    {[
                        { Icon: Twitter, href: '#' },
                        { Icon: Github, href: '#' },
                        { Icon: Linkedin, href: '#' },
                        { Icon: Mail, href: 'mailto:hello@example.com' }
                    ].map((item, i) => (
                        <a key={i} href={item.href} className="w-12 h-12 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-1">
                            <item.Icon className="w-5 h-5" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Simple Form */}
            <div className="bg-emerald-900/50 p-8 rounded-3xl border border-emerald-800/80">
                <h3 className="text-2xl font-bold text-white mb-2">Join the Newsletter</h3>
                <p className="text-emerald-300/80 mb-6">Seeds of insight delivered monthly. No spam.</p>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <input
                            type="text"
                            placeholder="Your name"
                            className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-emerald-600 transition-all font-medium"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-emerald-600 transition-all font-medium pr-14"
                        />
                        <button type="submit" className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center group">
                            <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>

        </div>

        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-emerald-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-emerald-400/60 text-sm font-medium">
            <p>© {new Date().getFullYear()} Evergreen Blog. All rights reserved.</p>
            <div className="flex gap-6">
                <a href="#" className="hover:text-emerald-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-emerald-300 transition-colors">Terms of Service</a>
            </div>
        </div>
    </footer>
);

export default Footer;

import React, { useEffect } from 'react';
import { Leaf, Send, Twitter, Github, Linkedin, Mail, ArrowRight, BookOpen, Hexagon } from 'lucide-react';

const Header = () => (
  <header className="w-full py-8 md:py-12 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
    <div className="flex items-center gap-3 cursor-pointer group">
      <div className="bg-emerald-600 p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-emerald-600/20">
        <Leaf className="w-6 h-6 text-white" />
      </div>
      <span className="font-bold text-2xl tracking-tight text-emerald-950">SoulTrees</span>
    </div>
    <nav className="hidden md:flex gap-10">
      {['Home', 'Blog', 'Contact', 'Dashbroad' ].map((item) => (
        <a 
          key={item} 
          href={`#${item.toLowerCase()}`} 
          className="text-emerald-800 font-medium hover:text-emerald-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-600 after:transition-all after:duration-300 pb-1"
        >
          {item}
        </a>
      ))}
    </nav>
    <button className="md:hidden text-emerald-950">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>
  </header>
);

const HeroQuote = () => (
  <section className="relative w-full h-[600px] bg-[url('https://images.unsplash.com/photo-1462143338528-eca9936a4d09?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center flex items-center justify-center">

      {/* overlay cho dễ đọc chữ */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-8">
          Ta đặt giới hạn tuổi cho mọi thứ —
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400">
            {" "}
            trừ sự ngu ngốc
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed">
          Một trang web blog cá nhân
        </p>
      </div>

    </section>
);

const timelineData = [
  {
    id: 1,
    date: 'March 10, 2026',
    title: 'Science',
    description: 'Exploring how deep foundations in architecture lead to systems that weather any storm. A look into modern resilient design patterns.',
    category: 'Design Systems',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1485368510545-b1f4bcd02d0d'
  },
  {
    id: 2,
    date: 'February 24, 2026',
    title: 'Buddhism & Stoicism',
    description: 'When UI components overshadow each other. Understanding z-index structures and managing complex overlaps in modern web applications.',
    category: 'Frontend',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1550141627-edb66a32a2eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    date: 'February 15, 2026',
    title: 'Psychology & Neuroscience',
    description: 'Turning light inputs into rich user experiences. A deep dive into creative coding and generative art on the web.',
    category: 'Creative Tech',
    readTime: '12 min read',
    image: 'https://unsplash.com/photos/a-row-of-books-on-a-shelf-in-a-library-zm4CcBeBbp8'
  },
  {
    id: 4,
    date: 'January 02, 2026',
    title: 'Fun & Books',
    description: 'Sometimes you have to cut back to grow. Lessons learned from breaking down a massive legacy application into micro-frontends.',
    category: 'Architecture',
    readTime: '15 min read',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3N8ZW58MHx8MHx8fDA%3D'
  },
   {
    id: 5,
    date: 'January 3, 2026',
    title: 'Languages',
    description: 'Sometimes you have to cut back to grow. Lessons learned from breaking down a massive legacy application into micro-frontends.',
    category: 'Architecture',
    readTime: '15 min read',
    image: 'https://unsplash.com/@brett_jordan'
  }, {
    id: 6,
    date: 'January 02, 2026',
    title: 'Self',
    description: 'Sometimes you have to cut back to grow. Lessons learned from breaking down a massive legacy application into micro-frontends.',
    category: 'Architecture',
    readTime: '15 min read',
    image: 'https://plus.unsplash.com/premium_photo-1661963810374-85a874671aa8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2VsZnxlbnwwfHwwfHx8MA%3D%3D'
  }
];



const Timeline = () => {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto relative">
      <div className="text-center mb-24">
        <h2 className="text-3xl font-bold text-emerald-950 mb-4 tracking-tight">Sections</h2>
        <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
      </div>
      
      {/* The Central Line */}
      <div className="absolute left-6 md:left-1/2 top-48 bottom-0 w-1 bg-emerald-200 md:-translate-x-1/2 rounded-full hidden md:block"></div>
      
      <div className="space-y-16 md:space-y-24 relative z-10">
        {timelineData.map((node, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={node.id} className={`flex flex-col md:flex-row items-center justify-between w-full group ${isEven ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Empty space for one side */}
              <div className="hidden md:block md:w-5/12">
                <div
                className="bg-cover bg-center h-[250px] rounded-2xl shadow"
                style={{ backgroundImage: `url(${node.image})` }}
              ></div>
  
              </div>
              
              {/* Center Node dot */}
              <div className="hidden md:flex relative w-12 h-12 rounded-full bg-emerald-50 border-4 border-emerald-500 items-center justify-center z-20 shadow-[0_0_0_8px_rgba(16,185,129,0.1)] group-hover:bg-emerald-500 transition-colors duration-300">
                <BookOpen className="w-5 h-5 text-emerald-500 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Mobile Node Dot + Line Connector */}
              <div className="md:hidden absolute left-6 w-4 h-4 rounded-full bg-emerald-500 -translate-x-[6px] mt-2 border-4 border-emerald-50"></div>

              {/* Content Card */}
              <div className="w-full pl-12 md:pl-0 md:w-5/12 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="relative bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.12)] transition-shadow border border-emerald-50">
                  {/* Connectors for desktop */}
                  <div className={`hidden md:block absolute top-1/2 w-8 h-0.5 bg-emerald-200 -translate-y-1/2 ${isEven ? '-left-8' : '-right-8'}`}></div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">{node.category}</span>
                    <span className="text-sm text-emerald-400 font-medium">{node.readTime}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-emerald-950 mb-3">{node.title}</h3>
                  <p className="text-emerald-700 leading-relaxed mb-6">{node.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 py-1.5 px-4 rounded-full">{node.date}</span>
                    <button className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-800 transition-colors group/btn">
                      Read
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          );
        })}
      </div>

      
    </section>
  );
};

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

function App() {
  return (
    <div className="min-h-screen bg-emerald-50/50 selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden font-sans">
      <Header />
      <main>
        <HeroQuote />
        <Timeline />
      </main>
      <Footer />
    </div>
  );
}

export default App;

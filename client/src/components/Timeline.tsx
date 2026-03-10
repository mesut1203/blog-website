import { BookOpen, ArrowRight } from 'lucide-react';

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
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2873&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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

export default Timeline;

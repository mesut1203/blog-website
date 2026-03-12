import { BookOpen, ArrowRight, Microscope, HandHeart, Brain, Globe, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const getRouteForTitle = (title: string) => {
    const t = title.toLowerCase();
    if (t === 'science') return '/science';
    if (t === 'buddhism & stoicism') return '/buddhism-stoicism';
    if (t === 'psychology & neuroscience') return '/psychology';
    if (t === 'fun & books') return '/fun-books';
    if (t === 'languages') return '/languages';
    if (t === 'self') return '/self';
    return '#';
};

const timelineData = [
    {
        id: 1,
        title: 'Science',
        description: 'Exploring the principles and discoveries that shape our universe, from the smallest particles to the vastness of space',
        image: 'https://images.unsplash.com/photo-1485368510545-b1f4bcd02d0d',
        Icon: Microscope
    },
    {
        id: 2,
        title: 'Buddhism & Stoicism',
        description: 'Lessons from Buddhism and Stoicism on mastering the mind, embracing impermanence, and living with purpose',
        image: 'https://images.unsplash.com/photo-1550141627-edb66a32a2eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        Icon: HandHeart
    },
    {
        id: 3,
        title: 'Psychology & Neuroscience',
        description: 'Understanding the human mind, behavior, and brain through psychology, neuroscience, and scientific insight',
        image: 'https://images.unsplash.com/photo-1638443436690-db587cc66f12?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        Icon: Brain
    },
    {
        id: 4,
        title: 'Fun & Books',
        description: 'A collection of ideas, stories, and book discoveries that inspire curiosity, learning, and imagination',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3N8ZW58MHx8MHx8fDA%3D',
        Icon: BookOpen
    },
    {
        id: 5,
        title: 'Languages',
        description: 'Words, cultures, and the journey of learning new languages',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2873&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        Icon: Globe
    }, {
        id: 6,
        title: 'Self',
        description: 'Reflections on personal growth, self-discovery, and the ongoing journey of becoming a better human.',
        image: 'https://plus.unsplash.com/premium_photo-1661963810374-85a874671aa8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2VsZnxlbnwwfHwwfHx8MA%3D%3D',
        Icon: User
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
                                <node.Icon className="w-5 h-5 text-emerald-500 group-hover:text-white transition-colors duration-300" />
                            </div>

                            {/* Mobile Node Dot + Line Connector */}
                            <div className="md:hidden absolute left-6 w-4 h-4 rounded-full bg-emerald-500 -translate-x-[6px] mt-2 border-4 border-emerald-50"></div>

                            {/* Content Card */}
                            <div className="w-full pl-12 md:pl-0 md:w-5/12 group-hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.12)] transition-shadow border border-emerald-50">
                                    {/* Connectors for desktop */}
                                    <div className={`hidden md:block absolute top-1/2 w-8 h-0.5 bg-emerald-200 -translate-y-1/2 ${isEven ? '-left-8' : '-right-8'}`}></div>

                                    

                                    <h3 className="text-2xl font-bold text-emerald-950 mb-3">{node.title}</h3>
                                    <p className="text-emerald-700 leading-relaxed mb-6">{node.description}</p>

                                    <div className="flex items-center justify-end mt-auto">
                                        
                                        <Link
                                            to={getRouteForTitle(node.title)}
                                            className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-800 transition-colors group/btn"
                                        >
                                            Read
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
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

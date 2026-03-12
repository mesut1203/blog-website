import { useState, useEffect } from 'react';
import { getBlogs, getCategories } from '../lib/api';
import type { Blog } from '../types';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ScienceHero = () => (
    <section className="relative w-full overflow-hidden py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 z-0 bg-[url('https://plus.unsplash.com/premium_photo-1661432575489-b0400f4fea58?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center"></div>
        <div className="absolute inset-0 z-0 bg-black/40"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                Exploring the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-300">Roots of Knowledge.</span>
            </h1>
            <p className="text-lg md:text-2xl text-teal-50/80 max-w-3xl mx-auto font-medium leading-relaxed">
                Dive deep into the science behind systems, architecture, and the natural patterns of growth in technology.
            </p>
        </div>
    </section>
);

const ScienceFeaturedPost = ({ post, categoryName }: { post: Blog, categoryName: string }) => {
    // Basic excerpt generation from content if no excerpt field exists
    const excerpt = post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content;
    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="mb-20">
            <h2 className="text-2xl font-bold text-emerald-950 mb-8 border-b-2 border-emerald-100 pb-2 inline-block">Featured Exploration</h2>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50 group hover:shadow-[0_8px_40px_rgba(16,185,129,0.08)] transition-all duration-300">
                <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto border border-emerald-50 rounded-2xl overflow-hidden relative">
                    {post.cover_image ? (
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-500 font-medium">No Image</div>
                    )}
                    <div className="absolute top-4 border-2 border-white/50 left-4 bg-emerald-600/90 backdrop-blur text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-full">
                        {categoryName}
                    </div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-emerald-500 font-medium mb-4">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formattedDate}</span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-emerald-950 mb-4 leading-tight">{post.title}</h3>
                    <p className="text-emerald-700 text-lg leading-relaxed mb-8">{excerpt}</p>

                    <div className="mt-auto">
                        <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 py-3 px-6 rounded-xl font-semibold transition-all hover:gap-3 shadow-lg shadow-emerald-600/20 active:scale-95">
                            Read Article
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SciencePostCard = ({ post, categoryName }: { post: Blog, categoryName: string }) => {
    const excerpt = post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content;
    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="flex flex-col bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-emerald-50 group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all duration-300">
            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5 relative bg-emerald-50 border border-emerald-100/50">
                {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-400 font-medium text-sm">Pattern Default</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-emerald-600 text-xs font-extrabold uppercase tracking-wider py-1 px-2.5 rounded-lg border border-emerald-100/50">
                    {categoryName}
                </div>
            </div>

            <div className="flex flex-col flex-1">
                <span className="text-xs text-emerald-400 font-semibold mb-2">{formattedDate}</span>
                <h4 className="text-xl font-bold text-emerald-950 mb-3 leading-snug group-hover:text-emerald-700 transition-colors">{post.title}</h4>
                <p className="text-emerald-700/90 text-sm leading-relaxed mb-6 flex-1">{excerpt}</p>

                <div className="mt-auto pt-4 border-t border-emerald-50 flex items-center justify-between">
                    <Link to={`/blog/${post.id}`} className="flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-800 transition-colors group/btn text-sm">
                        Read
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Science() {
    const [sciencePosts, setSciencePosts] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScienceData = async () => {
            try {
                // Fetch categories and blogs
                const categories = await getCategories();
                const blogs = await getBlogs();

                // Find the ID for the 'Science' category
                // For this mock implementation, we filter by category logic:
                // If it's a real API: const scienceCategory = categories.find(c => c.name.toLowerCase() === 'science');
                // Because we might not have 'Science' populated, we mock the filtering behavior 
                // Alternatively, just grab the first few blogs to display layout if DB is empty
                
                const scienceCategory = categories.find(c => c.name.toLowerCase() === 'science');
                let filteredBlogs: Blog[] = [];
                
                if (scienceCategory) {
                     filteredBlogs = blogs.filter(b => b.category_id === scienceCategory.id);
                } else if(blogs.length > 0) {
                     // Fallback if no specific 'Science' category is found in mock DB yet, just show anything available
                     filteredBlogs = blogs;
                }

                setSciencePosts(filteredBlogs);
            } catch (error) {
                console.error("Failed to fetch science posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScienceData();
    }, []);

    const featuredPost = sciencePosts.length > 0 ? sciencePosts[0] : null;
    const remainingPosts = sciencePosts.length > 1 ? sciencePosts.slice(1) : [];

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 w-full flex flex-col items-center">
                <ScienceHero />

                <section className="w-full max-w-7xl mx-auto px-6 py-20">
                    {loading ? (
                        <div className="w-full py-32 flex justify-center items-center">
                            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        </div>
                    ) : sciencePosts.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-3xl border border-emerald-100 mx-6 shadow-sm">
                            <h3 className="text-2xl font-bold text-emerald-900 mb-2">No observations recorded yet.</h3>
                            <p className="text-emerald-600">The forest is quiet today. Return soon for new scientific insights.</p>
                        </div>
                    ) : (
                        <>
                            {featuredPost && <ScienceFeaturedPost post={featuredPost} categoryName="Science" />}

                            {remainingPosts.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-emerald-950 mb-8 border-b-2 border-emerald-100 pb-2 inline-block">Latest Field Notes</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {remainingPosts.map(post => (
                                            <SciencePostCard key={post.id} post={post} categoryName="Science" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}

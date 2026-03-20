import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react';
import { getBlogWithCategory } from '../lib/api';
import type { BlogWithCategory } from '../types';

export default function BlogDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogWithCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadBlog() {
            if (!id) return;
            try {
                const data = await getBlogWithCategory(id);
                if (!data) {
                    setError('Blog post not found.');
                } else {
                    setBlog(data);
                }
            } catch (err) {
                console.error('Failed to fetch blog detail', err);
                setError('Failed to load the article. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        loadBlog();
    }, [id]);

    // Simple reading time estimation (approx. 200 words per minute)
    const getReadingTime = (text: string) => {
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / 200);
        return time === 1 ? '1 min read' : `${time} min read`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-emerald-50/30 flex justify-center items-center">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-emerald-50/30 flex flex-col justify-center items-center px-6 text-center">
                <h2 className="text-3xl font-bold text-emerald-950 mb-4">{error || 'Something went wrong.'}</h2>
                <button
                    onClick={() => navigate('/blog')}
                    className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Blog
                </button>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-emerald-50/20 pb-20">
            {/* Hero Section */}
            <div className="relative h-[45vh] min-h-[300px] w-full bg-emerald-950 overflow-hidden">
                {blog.cover_image ? (
                    <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-900 to-teal-900 opacity-80"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/50 to-emerald-900/20"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 md:px-12 text-center z-10 max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 text-emerald-300 font-semibold uppercase tracking-wider text-sm mb-4 flex-wrap justify-center">
                        {blog.categories && (
                            <span className="flex items-center gap-1.5 bg-emerald-900/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-emerald-700/50 shadow-sm">
                                <Tag className="w-4 h-4" />
                                {blog.categories.name}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {getReadingTime(blog.content)}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
                        {blog.title}
                    </h1>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-8 relative z-20">
                <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-emerald-950/5 border border-white">
                    <div className="prose prose-lg md:prose-xl prose-emerald max-w-none text-emerald-900/80 leading-relaxed font-sans">
                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                        <style>{`
                            .blog-content h1 { font-size: 2rem; font-weight: 800; color: #064e3b; margin: 1.5rem 0 0.75rem; line-height: 1.2; }
                            .blog-content h2 { font-size: 1.5rem; font-weight: 700; color: #065f46; margin: 1.25rem 0 0.6rem; line-height: 1.3; }
                            .blog-content h3 { font-size: 1.2rem; font-weight: 700; color: #047857; margin: 1rem 0 0.5rem; line-height: 1.4; }
                            .blog-content p { margin-bottom: 1.1rem; line-height: 1.8; }
                            .blog-content ul { list-style: disc; padding-left: 1.75rem; margin-bottom: 1rem; }
                            .blog-content ol { list-style: decimal; padding-left: 1.75rem; margin-bottom: 1rem; }
                            .blog-content li { margin-bottom: 0.4rem; line-height: 1.7; }
                            .blog-content blockquote { border-left: 4px solid #34d399; padding: 0.75rem 1.25rem; background: #f0fdf4; border-radius: 0 0.75rem 0.75rem 0; color: #065f46; font-style: italic; margin: 1.25rem 0; }
                            .blog-content a { color: #059669; text-decoration: underline; font-weight: 500; }
                            .blog-content a:hover { color: #047857; }
                            .blog-content img {
                                max-width: 85%;
                                max-height: 300px;
                                height: auto;
                                object-fit: contain;
                                display: block;
                                margin: 1.5rem auto;
                                border-radius: 1rem;
                                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                                border: 1px solid #f0fdf4;
                            }
                            .blog-content b, .blog-content strong { font-weight: 700; color: #064e3b; }
                            .blog-content i, .blog-content em { font-style: italic; }
                            .blog-content u { text-decoration: underline; }
                        `}</style>
                    </div>

                    <div className="mt-16 pt-8 border-t border-emerald-100/80 flex justify-center">
                        <button
                            onClick={() => {
                                if (window.history.length > 2) {
                                    navigate(-1);
                                } else {
                                    navigate('/blog');
                                }
                            }}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-600/20 group cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Return Back
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

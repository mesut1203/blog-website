import { useState, useEffect, useMemo } from 'react';
import { getBlogs, getCategories } from '../lib/api';
import type { Blog, Category } from '../types';
import { ArrowRight, Calendar, Tag, BookOpen, Gamepad2, Mountain, Palette, Library, Search, SlidersHorizontal, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const FunBooksHero = () => (
    <section className="relative w-full overflow-hidden py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 z-0 bg-black/40"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
            <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-sm mb-6 block">Fun & Books</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                Adventures in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-300">Literature.</span>
            </h1>
            <p className="text-lg md:text-2xl text-emerald-50/80 max-w-3xl mx-auto font-medium leading-relaxed">
                Exploring worlds beyond ours through great books, hobbies, and the joy of reading.
            </p>
        </div>
    </section>
);

function getPageNumbers(cur: number, total: number): (number | '...')[] {
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
    const p: (number | '...')[] = [];
    const a = (n: number) => { if (!p.includes(n)) p.push(n); };
    const e = () => { if (p[p.length - 1] !== '...') p.push('...'); };
    a(1); a(2);
    if (cur > 4) e();
    for (let i = Math.max(3, cur - 1); i <= Math.min(total - 2, cur + 1); i++) a(i);
    if (cur < total - 3) e();
    a(total - 1); a(total);
    return p;
}

export default function FunBooks() {
    const [allPosts, setAllPosts] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilterId, setActiveFilterId] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;

    useEffect(() => {
        async function load() {
            try {
                const [cats, blogs] = await Promise.all([getCategories(), getBlogs()]);
                setCategories(cats);
                const root = cats.find(c => (c.name.toLowerCase().includes('fun') || c.name.toLowerCase().includes('book')) && !c.parent_id);
                if (root) {
                    const ids = new Set([root.id, ...cats.filter(c => c.parent_id === root.id).map(c => c.id)]);
                    setAllPosts(blogs.filter(b => b.category_id && ids.has(b.category_id)));
                } else setAllPosts(blogs);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        }
        load();
    }, []);

    useEffect(() => { const h = setTimeout(() => { setDebouncedSearch(searchQuery); setCurrentPage(1); }, 400); return () => clearTimeout(h); }, [searchQuery]);
    useEffect(() => { setCurrentPage(1); }, [activeFilterId]);

    const subCategories = useMemo(() => {
        const root = categories.find(c => (c.name.toLowerCase().includes('fun') || c.name.toLowerCase().includes('book')) && !c.parent_id);
        return root ? categories.filter(c => c.parent_id === root.id) : [];
    }, [categories]);

    const filteredPosts = useMemo(() => {
        let r = activeFilterId !== 'All' ? allPosts.filter(p => p.category_id === activeFilterId) : allPosts;
        if (debouncedSearch) { const q = debouncedSearch.toLowerCase(); r = r.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)); }
        return r;
    }, [allPosts, activeFilterId, debouncedSearch]);

    const totalPages = Math.ceil(filteredPosts.length / limit) || 1;
    const paginatedPosts = filteredPosts.slice((currentPage - 1) * limit, currentPage * limit);
    const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

    const getIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('book') || n.includes('read')) return <BookOpen className="w-4 h-4" />;
        if (n.includes('game') || n.includes('fun')) return <Gamepad2 className="w-4 h-4" />;
        if (n.includes('travel') || n.includes('advent')) return <Mountain className="w-4 h-4" />;
        if (n.includes('art') || n.includes('creat')) return <Palette className="w-4 h-4" />;
        return <Library className="w-4 h-4" />;
    };

    const selectedLabel = activeFilterId === 'All' ? 'All Stories' : (subCategories.find(c => c.id === activeFilterId)?.name ?? 'Filter');

    return (
        <div className="min-h-screen bg-emerald-50/30">
            <FunBooksHero />
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-16 relative z-30">
                <div className="mb-12 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row gap-4 items-center border border-emerald-100 relative z-40">
                    <div className="relative w-full md:flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600/50 group-focus-within:text-emerald-600 transition-colors"><Search className="w-5 h-5" /></div>
                        <input type="text" placeholder="Search books, hobbies, and stories..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-emerald-50/50 border border-emerald-100/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-emerald-950 placeholder-emerald-600/50 transition-all font-medium shadow-sm" />
                    </div>
                    <div className="relative w-full md:w-64">
                        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 rounded-2xl px-5 py-3.5 text-emerald-900 font-semibold hover:bg-emerald-100/50 transition-colors shadow-sm">
                            <div className="flex items-center gap-3"><SlidersHorizontal className="w-5 h-5 text-emerald-600" /><span>{selectedLabel}</span></div>
                            <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isFilterOpen && (
                            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden z-50 py-2">
                                <button onClick={() => { setActiveFilterId('All'); setIsFilterOpen(false); }} className={`w-full text-left px-5 py-3 text-sm font-semibold flex items-center justify-between transition-colors ${activeFilterId === 'All' ? 'bg-emerald-50 text-emerald-700' : 'text-emerald-900 hover:bg-emerald-50/50'}`}>
                                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-500" />All Stories</span>
                                    {activeFilterId === 'All' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                                </button>
                                {subCategories.map(cat => (
                                    <button key={cat.id} onClick={() => { setActiveFilterId(cat.id); setIsFilterOpen(false); }} className={`w-full text-left px-5 py-3 text-sm font-semibold flex items-center justify-between transition-colors ${activeFilterId === cat.id ? 'bg-emerald-50 text-emerald-700' : 'text-emerald-900 hover:bg-emerald-50/50'}`}>
                                        <span className="flex items-center gap-2"><span className="text-emerald-500">{getIcon(cat.name)}</span>{cat.name}</span>
                                        {activeFilterId === cat.id && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-10 flex items-center justify-between text-emerald-800/70 font-semibold px-2">
                    <p>{loading ? 'Loading...' : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'result' : 'results'}`}</p>
                    {debouncedSearch && <p>for &ldquo;{debouncedSearch}&rdquo;</p>}
                </div>

                {loading ? <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedPosts.map(blog => {
                            const cat = blog.category_id ? categoryMap.get(blog.category_id) : undefined;
                            return (
                                <article key={blog.id} className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-2 border border-white group flex flex-col">
                                    {blog.cover_image && <div className="mb-6 overflow-hidden rounded-[1.5rem] h-48 shrink-0"><img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>}
                                    <div className="flex items-center gap-3 text-xs font-bold text-emerald-600 mb-4 uppercase tracking-wider flex-wrap">
                                        {cat && <span className="flex items-center gap-1.5 bg-emerald-100/80 px-3 py-1.5 rounded-full text-emerald-800"><Tag className="w-3.5 h-3.5" />{cat.name}</span>}
                                        <span className="flex items-center gap-1.5 text-emerald-600/60 font-medium"><Calendar className="w-3.5 h-3.5" />{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <Link to={`/blog/${blog.id}`} className="text-xl font-bold text-emerald-950 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">{blog.title}</Link>
                                    <p className="text-emerald-800/70 line-clamp-3 leading-relaxed mb-6 flex-1 text-sm">{blog.content}</p>
                                    <div className="pt-4 border-t border-emerald-100/50 mt-auto">
                                        <Link to={`/blog/${blog.id}`} className="text-emerald-600 font-bold text-sm flex items-center gap-2 hover:text-emerald-700 transition-colors">Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
                                    </div>
                                </article>
                            );
                        })}
                        {paginatedPosts.length === 0 && (
                            <div className="col-span-full text-center py-32 bg-white/40 rounded-[3rem] border border-white/50">
                                <div className="bg-emerald-100/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"><Library className="w-10 h-10 text-emerald-400" /></div>
                                <h3 className="text-3xl font-bold text-emerald-950 mb-3">The shelf is empty.</h3>
                                <p className="text-emerald-700/70 text-lg max-w-sm mx-auto">No stories found. Explore other chapters.</p>
                                <button onClick={() => { setSearchQuery(''); setActiveFilterId('All'); }} className="mt-8 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">Clear all filters</button>
                            </div>
                        )}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-2 flex-wrap">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPage === 1 ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed' : 'bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md'}`}>Previous</button>
                        <div className="flex gap-1 flex-wrap justify-center">
                            {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                                page === '...' ? <span key={`e${idx}`} className="w-10 h-10 flex items-center justify-center text-emerald-400 font-bold">&hellip;</span>
                                    : <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === page ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-sm'}`}>{page}</button>
                            )}
                        </div>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPage === totalPages ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed' : 'bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md'}`}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}

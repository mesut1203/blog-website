import { useState, useEffect, useMemo, useRef } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { useScrollRestore } from '../hooks/useScrollRestore';
import { Brain, BrainCircuit, Calendar, Tag, Search, SlidersHorizontal, ArrowRight, ChevronDown, Heart, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBlogs, getCategories } from '../lib/api';
import type { Blog, Category } from '../types';

const PsychologyHero = () => (
    <section className="relative w-full overflow-hidden py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 z-0 bg-black/40"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
            <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-sm mb-6 block">Psychology & Neuroscience</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                Unlocking the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-300">Human Mind.</span>
            </h1>
            <p className="text-lg md:text-2xl text-emerald-50/80 max-w-3xl mx-auto font-medium leading-relaxed">
                A journey into cognitive processes, behavior, and the neuroscience of our everyday lives.
            </p>
        </div>
    </section>
);

export default function Psychology() {
    const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = usePersistedState('psych_search', '');
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
    const [selectedCategory, setSelectedCategory] = usePersistedState('psych_filter', 'All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = usePersistedState('psych_page', 1);
    const limit = 6;

    useScrollRestore(loading);

    // Fetch all data on mount — Dashboard sync is automatic since blogs come straight from DB
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [fetchedBlogs, fetchedCategories] = await Promise.all([
                    getBlogs(),
                    getCategories()
                ]);
                setAllBlogs(fetchedBlogs);
                setCategories(fetchedCategories);
            } catch (err) {
                console.error('[Psychology] Failed to load data', err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const isMounted = useRef(false);

    // Debounce search
    useEffect(() => {
        const mounted = isMounted.current;
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (mounted) {
                setCurrentPage(1);
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => { 
        if (isMounted.current) {
            setCurrentPage(1); 
        }
    }, [selectedCategory]);

    useEffect(() => { 
        isMounted.current = true; 
        return () => { isMounted.current = false; };
    }, []);

    // Build psychology category tree
    const psychRoot = useMemo(() =>
        categories.find(c => !c.parent_id && c.name.toLowerCase().includes('psychology')),
        [categories]
    );

    const subCategories = useMemo(() =>
        psychRoot ? categories.filter(c => c.parent_id === psychRoot.id) : [],
        [categories, psychRoot]
    );

    // All IDs belonging to psychology section (root + children)
    const psychologyIds = useMemo(() => {
        if (!psychRoot) return new Set<string>();
        return new Set([psychRoot.id, ...subCategories.map(c => c.id)]);
    }, [psychRoot, subCategories]);

    // Category map for looking up names
    const categoryMap = useMemo(() =>
        new Map(categories.map(c => [c.id, c])),
        [categories]
    );

    // Filter & search blogs — scoped to psychology section
    const filteredBlogs = useMemo(() => {
        let result = allBlogs.filter(b => b.category_id && psychologyIds.has(b.category_id));

        // Apply sub-category filter
        if (selectedCategory !== 'All') {
            const cat = subCategories.find(c => c.name === selectedCategory);
            if (cat) result = result.filter(b => b.category_id === cat.id);
        }

        // Apply search
        if (debouncedSearch) {
            const q = debouncedSearch.toLowerCase();
            result = result.filter(b =>
                b.title.toLowerCase().includes(q) || b.content.toLowerCase().includes(q)
            );
        }

        return result;
    }, [allBlogs, psychologyIds, selectedCategory, debouncedSearch, subCategories]);

    // Pagination
    const totalResults = filteredBlogs.length;
    const totalPages = Math.ceil(totalResults / limit) || 1;
    const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * limit, currentPage * limit);

    const getIconForCategory = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('neuroscience') || n.includes('brain')) return <BrainCircuit className="w-4 h-4" />;
        if (n.includes('emotion') || n.includes('heart')) return <Heart className="w-4 h-4" />;
        if (n.includes('psychology') || n.includes('behavior')) return <Brain className="w-4 h-4" />;
        return <Activity className="w-4 h-4" />;
    };

    return (
        <div className="min-h-screen bg-emerald-50/30">
            <PsychologyHero />

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-16 relative z-30">

                {/* Search and Filter Bar */}
                <div className="mb-12 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row gap-4 items-center justify-between border border-emerald-100 relative z-40">

                    {/* Search */}
                    <div className="relative w-full md:flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600/50 group-focus-within:text-emerald-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search psychology & neuroscience articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-emerald-50/50 border border-emerald-100/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-emerald-950 placeholder-emerald-600/50 transition-all font-medium shadow-sm"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative w-full md:w-64">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 rounded-2xl px-5 py-3.5 text-emerald-900 font-semibold hover:bg-emerald-100/50 transition-colors shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                                <span>{selectedCategory === 'All' ? 'All Insights' : selectedCategory}</span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden z-50">
                                <div className="py-2">
                                    <button
                                        onClick={() => { setSelectedCategory('All'); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-5 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${selectedCategory === 'All' ? 'bg-emerald-50 text-emerald-700' : 'text-emerald-900 hover:bg-emerald-50/50'}`}
                                    >
                                        All Insights
                                        {selectedCategory === 'All' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                                    </button>

                                    {subCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { setSelectedCategory(cat.name); setIsFilterOpen(false); }}
                                            className={`w-full text-left px-5 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat.name ? 'bg-emerald-50 text-emerald-700' : 'text-emerald-900 hover:bg-emerald-50/50'}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="text-emerald-500">{getIconForCategory(cat.name)}</span>
                                                {cat.name}
                                            </span>
                                            {selectedCategory === cat.name && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-10 flex items-center justify-between text-emerald-800/70 font-semibold px-2">
                    <p>
                        {loading
                            ? 'Loading...'
                            : `Showing ${totalResults === 0 ? 0 : Math.min((currentPage - 1) * limit + 1, totalResults)}–${Math.min(currentPage * limit, totalResults)} of ${totalResults} ${totalResults === 1 ? 'result' : 'results'}`
                        }
                    </p>
                    {debouncedSearch && <p>for &ldquo;{debouncedSearch}&rdquo;</p>}
                </div>

                {loading && allBlogs.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedBlogs.map((blog) => {
                            const cat = blog.category_id ? categoryMap.get(blog.category_id) : undefined;
                            return (
                                <article
                                    key={blog.id}
                                    className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-2 border border-white group flex flex-col"
                                >
                                    {blog.cover_image && (
                                        <div className="mb-6 overflow-hidden rounded-[1.5rem] h-52 relative shrink-0">
                                            <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                            <img
                                                src={blog.cover_image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 text-xs font-bold text-emerald-600 mb-5 uppercase tracking-wider flex-wrap">
                                        {cat && (
                                            <span className="flex items-center gap-1.5 bg-emerald-100/80 px-3.5 py-1.5 rounded-full text-emerald-800">
                                                <Tag className="w-3.5 h-3.5" />
                                                {cat.name}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5 text-emerald-600/60 font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <Link
                                        to={`/blog/${blog.id}`}
                                        className="text-2xl font-bold text-emerald-950 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight"
                                    >
                                        {blog.title}
                                    </Link>

                                    <p className="text-emerald-800/70 line-clamp-3 leading-relaxed mb-6 flex-1 text-base">
                                        {blog.content.replace(/<[^>]+>/g, '')}
                                    </p>

                                    <div className="pt-5 border-t border-emerald-100/50 mt-auto">
                                        <Link
                                            to={`/blog/${blog.id}`}
                                            className="text-emerald-600 font-bold text-sm flex items-center gap-2 hover:text-emerald-700 transition-colors"
                                        >
                                            Read article
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}

                        {paginatedBlogs.length === 0 && (
                            <div className="col-span-full text-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/50">
                                <div className="bg-emerald-100/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Brain className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-emerald-950 mb-3">The mind is silent.</h3>
                                <p className="text-emerald-700/70 text-lg max-w-sm mx-auto">
                                    No articles found. Try adjusting your search or filter.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                    className="mt-8 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (() => {
                    // Build smart page list with ellipsis
                    const getPageNumbers = (): (number | '...')[] => {
                        if (totalPages <= 6) {
                            return Array.from({ length: totalPages }, (_, i) => i + 1);
                        }
                        const pages: (number | '...')[] = [];
                        const addPage = (n: number) => { if (!pages.includes(n)) pages.push(n); };
                        const addEllipsis = () => { if (pages[pages.length - 1] !== '...') pages.push('...'); };

                        // Always show first 2 pages
                        addPage(1);
                        addPage(2);

                        // Show ellipsis if current page is far from start
                        if (currentPage > 4) addEllipsis();

                        // Show window around current page
                        for (let i = Math.max(3, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
                            addPage(i);
                        }

                        // Show ellipsis if current page is far from end
                        if (currentPage < totalPages - 3) addEllipsis();

                        // Always show last 2 pages
                        addPage(totalPages - 1);
                        addPage(totalPages);

                        return pages;
                    };

                    return (
                        <div className="mt-16 flex justify-center items-center gap-2 flex-wrap">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPage === 1 ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed' : 'bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md'}`}
                            >
                                Previous
                            </button>

                            <div className="flex gap-1 flex-wrap justify-center">
                                {getPageNumbers().map((page, idx) =>
                                    page === '...' ? (
                                        <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-emerald-400 font-bold select-none">
                                            &hellip;
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === page ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-sm'}`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPage === totalPages ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed' : 'bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md'}`}
                            >
                                Next
                            </button>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

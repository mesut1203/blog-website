import { useState, useEffect } from 'react';
import { Leaf, Calendar, Tag, Search, SlidersHorizontal, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPaginatedBlogsWithCategories, getCategories } from '../lib/api';
import type { BlogWithCategory, Category } from '../types';

export default function Blog() {
    const [blogs, setBlogs] = useState<BlogWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const limit = 6;

    // Fetch static categories on mount
    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
    }, []);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Reset page to 1 on category change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    // Create separated category structures
    const mainCategories = categories.filter(c => !c.parent_id);
    const getSubCategories = (parentId: string) => categories.filter(c => c.parent_id === parentId);

    useEffect(() => {
        async function loadBlogs() {
            setLoading(true);
            try {
                let categoryNamesToFetch: string[] | string = selectedCategory;
                if (selectedCategory !== 'All') {
                    const baseCat = categories.find(c => c.name === selectedCategory);
                    if (baseCat && !baseCat.parent_id) {
                        const subcatNames = categories.filter(c => c.parent_id === baseCat.id).map(c => c.name);
                        categoryNamesToFetch = [baseCat.name, ...subcatNames];
                    }
                }

                const { data, totalCount } = await getPaginatedBlogsWithCategories({
                    page: currentPage,
                    limit,
                    search: debouncedSearchQuery,
                    categoryId: categoryNamesToFetch
                });
                setBlogs(data);
                setTotalResults(totalCount);
                setTotalPages(Math.ceil(totalCount / limit) || 1);
            } catch (error) {
                console.error('Failed to fetch blogs', error);
            } finally {
                setLoading(false);
            }
        }
        loadBlogs();
    }, [currentPage, debouncedSearchQuery, selectedCategory]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                    <Leaf className="absolute inset-0 m-auto w-8 h-8 text-emerald-600 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-50/30">
            {/* Hero Section with Background */}
            <div className="relative pt-40 pb-32 px-6 md:px-12 overflow-hidden bg-emerald-950">
                {/* Placeholder Image */}
                <div className="absolute inset-0 z-0 bg-emerald-950">
                    <img
                        src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRyZWV8ZW58MHx8MHx8fDA%3D"
                        alt="Forest Background"
                        className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-emerald-900/20"></div>
                </div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-sm mb-6 block">SoulTrees Journal</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
                        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Thoughts</span>
                    </h1>
                    <p className="text-xl text-emerald-100/90 leading-relaxed font-medium">
                        Dive into our latest articles, insights, and stories on nature, wellness, and mindful living.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-16 -mt-12 relative z-30">
                {/* Search and Filter Section */}
                <div className="mb-12 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row gap-4 items-center justify-between border border-emerald-100 relative z-40">
                    {/* Search */}
                    <div className="relative w-full md:flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600/50 group-focus-within:text-emerald-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search articles..."
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
                                <span>{selectedCategory}</span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl shadow-emerald-900/10 border border-emerald-100 overflow-visible z-30">
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('All');
                                            setIsFilterOpen(false);
                                        }}
                                        onMouseEnter={() => setHoveredCategory(null)}
                                        className={`w-full text-left px-5 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${selectedCategory === 'All'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'text-emerald-900 hover:bg-emerald-50/50'
                                            }`}
                                    >
                                        All
                                        {selectedCategory === 'All' && (
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        )}
                                    </button>

                                    {mainCategories.map(category => {
                                        const subcats = getSubCategories(category.id);
                                        const hasSubcats = subcats.length > 0;
                                        const isHovered = hoveredCategory === category.id;

                                        return (
                                            <div
                                                key={category.id}
                                                className="relative group/item"
                                                onMouseEnter={() => setHoveredCategory(category.id)}
                                                onMouseLeave={() => setHoveredCategory(null)}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategory(category.name);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${selectedCategory === category.name
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'text-emerald-900 hover:bg-emerald-50/50'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {category.name}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {selectedCategory === category.name && (
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                        )}
                                                        {hasSubcats && <ChevronRight className="w-4 h-4 text-emerald-400" />}
                                                    </div>
                                                </button>

                                                {/* Subcategories Dropdown */}
                                                {hasSubcats && isHovered && (
                                                    <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-xl shadow-xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden z-40 animate-in fade-in slide-in-from-left-2 duration-200">
                                                        {subcats.map(subcat => (
                                                            <button
                                                                key={subcat.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedCategory(subcat.name);
                                                                    setIsFilterOpen(false);
                                                                    setHoveredCategory(null);
                                                                }}
                                                                className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors flex items-center justify-between ${selectedCategory === subcat.name
                                                                    ? 'bg-emerald-50 text-emerald-700'
                                                                    : 'text-emerald-900 hover:bg-emerald-50/50'
                                                                    }`}
                                                            >
                                                                {subcat.name}
                                                                {selectedCategory === subcat.name && (
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Header */}
                <div className="mb-10 flex items-center justify-between text-emerald-800/70 font-semibold px-2 relative z-20">
                    <p>Showing {Math.min((currentPage - 1) * limit + 1, totalResults)} to {Math.min(currentPage * limit, totalResults)} of {totalResults} {totalResults === 1 ? 'result' : 'results'}</p>
                    {debouncedSearchQuery && (
                        <p>for "{debouncedSearchQuery}"</p>
                    )}
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {blogs.map((blog) => (
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

                            <div className="flex items-center gap-4 text-xs font-bold text-emerald-600 mb-5 uppercase tracking-wider">
                                {blog.categories && (
                                    <span className="flex items-center gap-1.5 bg-emerald-100/80 px-3.5 py-1.5 rounded-full text-emerald-800">
                                        <Tag className="w-3.5 h-3.5" />
                                        {blog.categories.name}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 text-emerald-600/60 font-medium">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <Link to={`/blog/${blog.id}`} className="text-2xl font-bold text-emerald-950 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight focus:outline-none">
                                {blog.title}
                            </Link>

                            <p className="text-emerald-800/70 line-clamp-3 leading-relaxed mb-6 flex-1 text-base">
                                {blog.content}
                            </p>

                            <div className="pt-5 border-t border-emerald-100/50 mt-auto flex items-center justify-between">
                                <Link
                                    to={`/blog/${blog.id}`}
                                    className="text-emerald-600 font-bold text-sm group-hover:text-emerald-700 flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg px-2 py-1 -ml-2"
                                >
                                    Read article
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </article>
                    ))}

                    {blogs.length === 0 && (
                        <div className="col-span-full text-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/50 shadow-inner">
                            <div className="bg-emerald-100/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-emerald-950 mb-3">No posts found</h3>
                            <p className="text-emerald-700/70 text-lg max-w-sm mx-auto">
                                We couldn't find any articles matching your search or filter criteria. Try adjusting them!
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-2 relative z-20">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPage === 1
                                ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed'
                                : 'bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md shadow-emerald-900/5'}`}
                        >
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                        : 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-sm'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPage === totalPages
                                ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed'
                                : 'bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md shadow-emerald-900/5'}`}
                        >
                            Next
                        </button>
                    </div>
                )}

                <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            </div>
        </div>
    );
}

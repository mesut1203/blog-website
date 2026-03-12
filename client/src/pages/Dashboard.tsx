import React, { useState, useEffect, useMemo } from 'react';
import {
    FileText,
    Search,
    Plus,
    Activity,
    MessageSquareQuote,
    Trash2,
    Edit,
    X,
    Save
} from 'lucide-react';
import { getBlogs, getQuotes, deleteBlog, deleteQuote, createBlog, updateBlog, createQuote, updateQuote, getCategories } from '../lib/api';
import type { Blog, Quote, Category, BlogInput, QuoteInput } from '../types';

// ==========================================
// REUSABLE COMPONENTS
// ==========================================
const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active
            ? 'bg-emerald-500 text-white font-medium shadow-md shadow-emerald-500/20'
            : 'text-emerald-700/70 hover:bg-emerald-50 hover:text-emerald-900 font-medium'
            }`}>
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-emerald-600'}`} />
        <span>{label}</span>
    </div>
);

const StatCard = ({ title, value, increase, icon: Icon }: { title: string, value: string | number, increase: string, icon: any }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.12)] transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <Icon className="w-6 h-6" />
            </div>
            {increase && <span className="text-sm font-semibold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">{increase}</span>}
        </div>
        <h3 className="text-3xl font-bold text-emerald-950 mb-1">{value}</h3>
        <p className="text-emerald-600/70 font-medium text-sm">{title}</p>
    </div>
);

// ==========================================
// DASHBOARD COMPONENT
// ==========================================
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'blogs' | 'quotes'>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

    // Form States
    const [blogForm, setBlogForm] = useState<BlogInput>({ title: '', content: '', cover_image: '', category_id: '' });
    const [quoteForm, setQuoteForm] = useState<QuoteInput>({ content: '' });
    const [isSaving, setIsSaving] = useState(false);

    const currentMainCategoryId = useMemo(() => {
        if (!blogForm.category_id) return '';
        const cat = categories.find(c => c.id === blogForm.category_id);
        if (cat && cat.parent_id) {
            return cat.parent_id;
        }
        return blogForm.category_id;
    }, [blogForm.category_id, categories]);

    const currentSubCategories = useMemo(() => {
        if (!currentMainCategoryId) return [];
        return categories.filter(c => c.parent_id === currentMainCategoryId);
    }, [currentMainCategoryId, categories]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [fetchedBlogs, fetchedQuotes, fetchedCategories] = await Promise.all([
                getBlogs(),
                getQuotes(),
                getCategories()
            ]);
            setBlogs(fetchedBlogs);
            setQuotes(fetchedQuotes);
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // FILTERING & SEARCHING
    // ==========================================
    const filteredBlogs = useMemo(() => {
        if (!searchQuery) return blogs;
        return blogs.filter(b =>
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [blogs, searchQuery]);

    const filteredQuotes = useMemo(() => {
        if (!searchQuery) return quotes;
        return quotes.filter(q => q.content.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [quotes, searchQuery]);

    // Combine for overview (take top 5 of each, sorted by date)
    const recentActivity = useMemo(() => {
        const mappedBlogs = filteredBlogs.map(b => ({ ...b, type: 'blog' as const }));
        const mappedQuotes = filteredQuotes.map(q => ({ ...q, type: 'quote' as const }));

        return [...mappedBlogs, ...mappedQuotes]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 8); // Show 8 most recent items in overview
    }, [filteredBlogs, filteredQuotes]);


    // ==========================================
    // ACTIONS
    // ==========================================
    const handleOpenBlogModal = (blog?: Blog) => {
        if (blog) {
            setEditingBlog(blog);
            setBlogForm({
                title: blog.title,
                content: blog.content,
                cover_image: blog.cover_image || '',
                category_id: blog.category_id || ''
            });
        } else {
            setEditingBlog(null);
            setBlogForm({ title: '', content: '', cover_image: '', category_id: '' });
        }
        setIsBlogModalOpen(true);
    };

    const handleSaveBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                title: blogForm.title,
                content: blogForm.content,
                cover_image: blogForm.cover_image || null,
                category_id: blogForm.category_id || null
            };

            if (editingBlog) {
                await updateBlog(editingBlog.id, payload);
            } else {
                await createBlog(payload);
            }
            setIsBlogModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Failed to save blog. See console for details.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (confirm("Are you sure you want to delete this blog?")) {
            await deleteBlog(id);
            fetchData();
        }
    }

    const handleOpenQuoteModal = (quote?: Quote) => {
        if (quote) {
            setEditingQuote(quote);
            setQuoteForm({ content: quote.content });
        } else {
            setEditingQuote(null);
            setQuoteForm({ content: '' });
        }
        setIsQuoteModalOpen(true);
    };

    const handleSaveQuote = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingQuote) {
                await updateQuote(editingQuote.id, quoteForm);
            } else {
                await createQuote(quoteForm);
            }
            setIsQuoteModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error saving quote:", error);
            alert("Failed to save quote. See console for details.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteQuote = async (id: string) => {
        if (confirm("Are you sure you want to delete this quote?")) {
            await deleteQuote(id);
            fetchData();
        }
    }

    // Helper function to find category name
    const getCategoryName = (id: string | null) => {
        if (!id) return 'Uncategorized';
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : id;
    };


    return (
        <div className="min-h-screen flex bg-emerald-50/30 relative">

            {/* Sidebar - Desktop Only */}
            <aside className="w-64 hidden lg:flex flex-col border-r border-emerald-100 bg-white/50 backdrop-blur-xl p-6">
                <div className="flex-1 space-y-2 mt-4">
                    <SidebarItem
                        icon={Activity}
                        label="Overview"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <SidebarItem
                        icon={FileText}
                        label="Blogs"
                        active={activeTab === 'blogs'}
                        onClick={() => setActiveTab('blogs')}
                    />
                    <SidebarItem
                        icon={MessageSquareQuote}
                        label="Quotes"
                        active={activeTab === 'quotes'}
                        onClick={() => setActiveTab('quotes')}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 lg:pl-12 w-full max-w-[1600px] mx-auto">

                {/* Top Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">Dashboard Overview</h1>
                        <p className="text-emerald-600/80 mt-1">Manage your content here</p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:min-w-[300px]">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm text-emerald-900 placeholder-emerald-300 text-sm font-medium"
                                placeholder={`Search ${activeTab === 'overview' ? 'blogs and quotes' : activeTab}...`}
                            />
                        </div>

                        <button
                            onClick={() => activeTab === 'quotes' ? handleOpenQuoteModal() : handleOpenBlogModal()}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-5 rounded-xl transition-all font-semibold shadow-md shadow-emerald-500/20 text-sm whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">New {activeTab === 'quotes' ? 'Quote' : 'Blog'}</span>
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Blogs" value={blogs.length} increase="" icon={FileText} />
                    <StatCard title="Total Quotes" value={quotes.length} increase="" icon={MessageSquareQuote} />
                </div>

                {/* Content Tabs Mobile */}
                <div className="flex lg:hidden gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('blogs')}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${activeTab === 'blogs' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                    >
                        Blogs
                    </button>
                    <button
                        onClick={() => setActiveTab('quotes')}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${activeTab === 'quotes' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                    >
                        Quotes
                    </button>
                </div>

                {/* Dynamic Content Tracking */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent flex rounded-full animate-spin"></div>
                    </div>
                ) : activeTab === 'overview' ? (
                    <div>
                        <h2 className="text-xl font-bold text-emerald-950 mb-6 flex items-center gap-2">
                            Recent Activity
                            {searchQuery && <span className="text-sm font-normal text-emerald-600 px-3 py-1 bg-emerald-100 rounded-full">Filtering by "{searchQuery}"</span>}
                        </h2>

                        <div className="bg-white rounded-[2rem] border border-emerald-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-emerald-50/50 text-emerald-800 text-sm border-b border-emerald-100">
                                            <th className="py-4 px-6 font-semibold min-w-[120px]">Type</th>
                                            <th className="py-4 px-6 font-semibold w-1/2">Content Preview</th>
                                            <th className="py-4 px-6 font-semibold hidden sm:table-cell">Date</th>
                                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {recentActivity.length === 0 ? (
                                            <tr><td colSpan={4} className="text-center py-12 text-emerald-500 font-medium">No activity matches that search.</td></tr>
                                        ) : recentActivity.map((item, i) => (
                                            <tr key={item.id} className={`border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors ${i === recentActivity.length - 1 ? 'border-b-0' : ''}`}>
                                                <td className="py-4 px-6">
                                                    {item.type === 'blog' ? (
                                                        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 py-1 px-2.5 rounded-full text-xs font-bold">
                                                            <FileText className="w-3.5 h-3.5" /> Blog
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 py-1 px-2.5 rounded-full text-xs font-bold">
                                                            <MessageSquareQuote className="w-3.5 h-3.5" /> Quote
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {item.type === 'blog' ? (
                                                        <>
                                                            <span className="font-semibold text-emerald-950 block">{(item as Blog).title}</span>
                                                            <span className="text-xs text-emerald-500 truncate max-w-xs sm:max-w-sm md:max-w-md block">
                                                                {getCategoryName((item as Blog).category_id)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="font-medium text-emerald-950 block italic truncate max-w-xs sm:max-w-sm md:max-w-md">"{(item as Quote).content}"</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-emerald-600 font-medium hidden sm:table-cell">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => item.type === 'blog' ? handleOpenBlogModal(item as Blog) : handleOpenQuoteModal(item as Quote)}
                                                            className="p-2 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-lg transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => item.type === 'blog' ? handleDeleteBlog(item.id) : handleDeleteQuote(item.id)}
                                                            className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'blogs' ? (
                    <div>
                        <h2 className="text-xl font-bold text-emerald-950 mb-6 flex items-center gap-2">
                            All Blogs
                            {searchQuery && <span className="text-sm font-normal text-emerald-600 px-3 py-1 bg-emerald-100 rounded-full">Filtering by "{searchQuery}"</span>}
                        </h2>

                        <div className="bg-white rounded-[2rem] border border-emerald-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-emerald-50/50 text-emerald-800 text-sm border-b border-emerald-100">
                                            <th className="py-4 px-6 font-semibold">Title</th>
                                            <th className="py-4 px-6 font-semibold hidden lg:table-cell">Category</th>
                                            <th className="py-4 px-6 font-semibold hidden sm:table-cell">Date</th>
                                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {filteredBlogs.length === 0 ? (
                                            <tr><td colSpan={4} className="text-center py-12 text-emerald-500 font-medium">No blogs found.</td></tr>
                                        ) : filteredBlogs.map((post, i) => (
                                            <tr key={post.id} className={`border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors ${i === filteredBlogs.length - 1 ? 'border-b-0' : ''}`}>
                                                <td className="py-4 px-6">
                                                    <span className="font-semibold text-emerald-950 block">{post.title}</span>
                                                    <span className="text-xs text-emerald-500 truncate max-w-xs block lg:hidden">{getCategoryName(post.category_id)}</span>
                                                </td>
                                                <td className="py-4 px-6 text-emerald-600 font-medium hidden lg:table-cell">
                                                    <span className="bg-emerald-100 py-1 px-2.5 rounded-full text-xs font-semibold">{getCategoryName(post.category_id)}</span>
                                                </td>
                                                <td className="py-4 px-6 text-emerald-600 font-medium hidden sm:table-cell">
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleOpenBlogModal(post)} className="p-2 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-lg transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteBlog(post.id)} className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold text-emerald-950 mb-6 flex items-center gap-2">
                            All Quotes
                            {searchQuery && <span className="text-sm font-normal text-emerald-600 px-3 py-1 bg-emerald-100 rounded-full">Filtering by "{searchQuery}"</span>}
                        </h2>

                        <div className="bg-white rounded-[2rem] border border-emerald-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-emerald-50/50 text-emerald-800 text-sm border-b border-emerald-100">
                                            <th className="py-4 px-6 font-semibold w-2/3">Content</th>
                                            <th className="py-4 px-6 font-semibold hidden sm:table-cell">Date</th>
                                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {filteredQuotes.length === 0 ? (
                                            <tr><td colSpan={3} className="text-center py-12 text-emerald-500 font-medium">No quotes found.</td></tr>
                                        ) : filteredQuotes.map((quote, i) => (
                                            <tr key={quote.id} className={`border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors ${i === filteredQuotes.length - 1 ? 'border-b-0' : ''}`}>
                                                <td className="py-4 px-6">
                                                    <span className="font-medium text-emerald-950 block italic text-base">"{quote.content}"</span>
                                                </td>
                                                <td className="py-4 px-6 text-emerald-600 font-medium hidden sm:table-cell">
                                                    {new Date(quote.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleOpenQuoteModal(quote)} className="p-2 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-lg transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteQuote(quote.id)} className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* ========================================== */}
            {/* BLOG MODAL                                 */}
            {/* ========================================== */}
            {isBlogModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-emerald-100">
                        <div className="p-6 sm:p-8 flex justify-between items-center bg-emerald-50/50 border-b border-emerald-100 sticky top-0 z-10">
                            <h2 className="text-2xl font-bold text-emerald-950">{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
                            <button
                                onClick={() => setIsBlogModalOpen(false)}
                                className="p-2 bg-white text-emerald-600 hover:bg-emerald-100 hover:text-emerald-900 rounded-xl transition-colors shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveBlog} className="p-6 sm:p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-emerald-900 ml-1">Title</label>
                                <input
                                    type="text"
                                    value={blogForm.title}
                                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                    className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-300 transition-all font-medium"
                                    placeholder="Enter blog title..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-emerald-900 ml-1">Category</label>
                                        <select
                                            value={currentMainCategoryId || ''}
                                            onChange={(e) => {
                                                const newMainCatId = e.target.value;
                                                setBlogForm({ ...blogForm, category_id: newMainCatId });
                                            }}
                                            className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 transition-all font-medium appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select a category...</option>
                                            {categories.filter(c => !c.parent_id).map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {currentSubCategories.length > 0 && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="text-sm font-semibold text-emerald-900 ml-1">Subcategory</label>
                                            <select
                                                value={blogForm.category_id === currentMainCategoryId ? '' : (blogForm.category_id || '')}
                                                onChange={(e) => setBlogForm({ ...blogForm, category_id: e.target.value })}
                                                className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 transition-all font-medium appearance-none"
                                                required
                                            >
                                                <option value="" disabled>Select specific category...</option>
                                                {currentSubCategories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-emerald-900 ml-1">Cover Image URL</label>
                                    <input
                                        type="url"
                                        value={blogForm.cover_image || ''}
                                        onChange={(e) => setBlogForm({ ...blogForm, cover_image: e.target.value })}
                                        className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-300 transition-all font-medium"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-emerald-900 ml-1">Content</label>
                                <textarea
                                    value={blogForm.content}
                                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                                    rows={8}
                                    className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-300 transition-all font-medium resize-y"
                                    placeholder="Write your amazing content here..."
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button
                                    type="button"
                                    onClick={() => setIsBlogModalOpen(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {isSaving ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {editingBlog ? 'Save Changes' : 'Create Blog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* QUOTE MODAL                                */}
            {/* ========================================== */}
            {isQuoteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl border border-emerald-100">
                        <div className="p-6 sm:p-8 flex justify-between items-center bg-emerald-50/50 border-b border-emerald-100">
                            <h2 className="text-2xl font-bold text-emerald-950">{editingQuote ? 'Edit Quote' : 'Create New Quote'}</h2>
                            <button
                                onClick={() => setIsQuoteModalOpen(false)}
                                className="p-2 bg-white text-emerald-600 hover:bg-emerald-100 hover:text-emerald-900 rounded-xl transition-colors shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveQuote} className="p-6 sm:p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-emerald-900 ml-1">Quote Content</label>
                                <textarea
                                    value={quoteForm.content}
                                    onChange={(e) => setQuoteForm({ content: e.target.value })}
                                    rows={4}
                                    className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-300 transition-all font-medium resize-y"
                                    placeholder="The best time to plant a tree..."
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsQuoteModalOpen(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {isSaving ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {editingQuote ? 'Save Changes' : 'Create Quote'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

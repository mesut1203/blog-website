import { supabase } from '../supabaseClient';
import type { Blog, BlogInput, BlogWithCategory, Category, Quote, QuoteInput } from '../types';

// ==========================================
// CATEGORIES
// ==========================================
export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) throw error;
    return data || [];
};

// ==========================================
// BLOGS
// ==========================================
export const getBlogs = async (): Promise<Blog[]> => {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const getBlogsWithCategories = async (): Promise<BlogWithCategory[]> => {
    const { data, error } = await supabase
        .from('blogs')
        .select('*, categories(*)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as any; // Type assertion needed because supabase join types are complex
};

export const getBlog = async (id: string): Promise<Blog | null> => {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

export const getBlogWithCategory = async (id: string): Promise<BlogWithCategory | null> => {
    const { data, error } = await supabase
        .from('blogs')
        .select('*, categories(*)')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // PostgREST code for "not found"
        throw error;
    }
    return data as any;
};

export const createBlog = async (blog: BlogInput): Promise<Blog> => {
    const { data, error } = await supabase
        .from('blogs')
        .insert([blog])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateBlog = async (id: string, updates: Partial<BlogInput>): Promise<Blog> => {
    const { data, error } = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteBlog = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// ==========================================
// QUOTES
// ==========================================
export const getQuotes = async (): Promise<Quote[]> => {
    const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const createQuote = async (quote: QuoteInput): Promise<Quote> => {
    const { data, error } = await supabase
        .from('quotes')
        .insert([quote])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateQuote = async (id: string, updates: Partial<QuoteInput>): Promise<Quote> => {
    const { data, error } = await supabase
        .from('quotes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteQuote = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

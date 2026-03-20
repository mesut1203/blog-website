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

export const getPaginatedBlogsWithCategories = async ({
    page = 1,
    limit = 6,
    search = '',
    categoryId = 'All'
}: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string | string[];
} = {}): Promise<{ data: BlogWithCategory[], totalCount: number }> => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('blogs')
        .select('*, categories!inner(*)', { count: 'exact' });

    if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (categoryId && categoryId !== 'All') {
        const ids = Array.isArray(categoryId) ? categoryId : [categoryId];
        // Check if the first element is a UUID (common for IDs) or a name
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ids[0]);
        if (isUuid) {
            query = query.in('category_id', ids);
        } else {
            query = query.in('categories.name', ids);
        }
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw error;

    return {
        data: data as any,
        totalCount: count || 0
    };
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

// ==========================================
// STORAGE
// ==========================================
export const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `blog-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) {
        console.error('Supabase Storage upload error:', uploadError);
        throw new Error(uploadError.message || 'Upload failed');
    }

    const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
        throw new Error('Could not get public URL for uploaded image');
    }

    return urlData.publicUrl;
};

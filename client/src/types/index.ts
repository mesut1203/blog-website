export interface Category {
    id: string;
    name: string;
    parent_id: string | null;
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    cover_image: string | null;
    category_id: string | null;
    created_at: string;
}

export interface BlogWithCategory extends Blog {
    categories: Category | null;
}

export type BlogInput = Omit<Blog, 'id' | 'created_at'>;

export interface Quote {
    id: string;
    content: string;
    created_at: string;
}

export type QuoteInput = Omit<Quote, 'id' | 'created_at'>;

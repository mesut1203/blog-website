import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText,
  Search,
  Activity,
  MessageSquareQuote,
  Trash2,
  Edit,
  X,
  Save,
  Clock,
  Quote as QuoteIcon,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Menu,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  getBlogs,
  getQuotes,
  deleteBlog,
  deleteQuote,
  createBlog,
  updateBlog,
  createQuote,
  updateQuote,
  getCategories,
  uploadImage,
} from "../lib/api";
import type { Blog, Quote, Category, BlogInput, QuoteInput } from "../types";

// ==========================================
// RICH TEXT EDITOR COMPONENT
// ==========================================
function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [isStuck, setIsStuck] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);

  // --- Selection Helpers ---
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        savedRange.current = range.cloneRange();
      }
    }
  };

  const restoreSelection = () => {
    if (savedRange.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRange.current);
      }
    }
  };

  // --- Prompt Modal State ---
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [promptPlaceholder, setPromptPlaceholder] = useState("");
  const [promptValue, setPromptValue] = useState("");
  const [promptCallback, setPromptCallback] = useState<(val: string) => void>(
    () => {},
  );

  const openPrompt = (
    title: string,
    placeholder: string,
    callback: (val: string) => void,
  ) => {
    setPromptTitle(title);
    setPromptPlaceholder(placeholder);
    setPromptValue("");
    setPromptCallback(() => callback);
    saveSelection(); // Capture current cursor before losing focus to modal
    setPromptOpen(true);
  };

  useEffect(() => {
    const scrollParent = toolbarRef.current?.closest(".overflow-y-auto");
    if (!scrollParent) return;

    const handleScroll = () => {
      if (!toolbarRef.current) return;
      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      const parentRect = scrollParent.getBoundingClientRect();

      // Check if it's stuck against the modal header (top: 80px/96px)
      const threshold = window.innerWidth < 640 ? 80 : 96;
      setIsStuck(toolbarRect.top <= parentRect.top + threshold + 1);
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (
        !editorRef.current ||
        !editorRef.current.contains(document.activeElement)
      )
        return;

      const formats = [
        "bold",
        "italic",
        "underline",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "insertUnorderedList",
        "insertOrderedList",
      ];
      const active = formats.filter((cmd) => document.queryCommandState(cmd));

      // For block formats like H1, H2, BLOCKQUOTE
      let blockFormat = document.queryCommandValue("formatBlock");

      if (blockFormat) {
        blockFormat = blockFormat.replace(/[<>]/g, "").toUpperCase();
        if (blockFormat === "H1" || blockFormat === "H2") {
          active.push(blockFormat);
        }
      }

      setActiveFormats(active);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  // Sync value into editor only when modal opens
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const exec = (command: string, formatValue?: string) => {
    editorRef.current?.focus();

    if (command === "formatBlock") {
      let current = document.queryCommandValue("formatBlock");

      // normalize (tránh browser trả về <h1>, h1,...)
      current = current?.replace(/[<>]/g, "").toUpperCase();

      if (current === formatValue) {
        document.execCommand("formatBlock", false, "P");
      } else {
        document.execCommand("formatBlock", false, formatValue);
      }
    } else {
      document.execCommand(command, false, formatValue);
    }

    syncContent();

    // Force highlight update immediately (equivalent to syncFormats)
    const formats = [
      "bold",
      "italic",
      "underline",
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
      "insertUnorderedList",
      "insertOrderedList",
    ];
    const active = formats.filter((cmd) => document.queryCommandState(cmd));
    let blockFormat = document.queryCommandValue("formatBlock");
    if (blockFormat) {
      blockFormat = blockFormat.replace(/[<>]/g, "").toUpperCase();
      if (
        blockFormat === "H1" ||
        blockFormat === "H2" ||
        blockFormat === "BLOCKQUOTE"
      )
        active.push(blockFormat);
    }
    setActiveFormats(active);
  };

  const syncContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLinkClick = () => {
    openPrompt("Insert URL", "https://example.com", (url) => {
      if (url) {
        restoreSelection();
        exec("createLink", url);
      }
    });
  };

  const handleImageUploadClick = () => {
    saveSelection(); // Capture current selection
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const url = await uploadImage(file, "inlines");
        restoreSelection();
        editorRef.current?.focus();

        // We use insertHTML instead of insertImage to avoid browsers creating unnecessary &nbsp; nodes.
        const imgHtml = `<img src="${url}" alt="Image" />`;
        document.execCommand("insertHTML", false, imgHtml);

        // Clean up any literal or unwanted &nbsp; strings from HTML that may have been generated
        if (
          editorRef.current &&
          editorRef.current.innerHTML.includes("&nbsp;")
        ) {
          editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
            /&nbsp;/g,
            " ",
          );
        }
        syncContent();
      } catch (error: any) {
        console.error("Upload error", error);
        alert("Failed to upload image: " + (error.message || "Unknown error"));
      }
    };
    input.click();
  };

  const ToolBtn = ({
    title,
    onClick,
    active,
    children,
  }: {
    title: string;
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`px-2 py-1.5 rounded-lg transition-colors text-sm font-medium ${
        active
          ? "bg-emerald-200 text-emerald-900 shadow-inner"
          : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
      }`}
    >
      {children}
    </button>
  );

  const handleRemoveFormat = () => {
    if (!editorRef.current) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editorRef.current.innerHTML;

    const process = (node: Node): string => {
      let output = "";
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          output += child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          if (el.tagName === "IMG") {
            output += el.outerHTML;
          } else if (el.tagName === "BR") {
            output += "<br>";
          } else {
            output += process(el);
          }
        }
      });
      return output;
    };

    editorRef.current.innerHTML = process(tempDiv);
    syncContent();
  };

  const isActive = (format: string) => activeFormats.includes(format);

  return (
    <div className="border border-emerald-100 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className={`flex flex-wrap items-center gap-0.5 px-3 py-2 bg-emerald-50 border-b border-emerald-100 sticky top-[80px] sm:top-[96px] z-10 backdrop-blur-md ${
          isStuck ? "rounded-none" : "rounded-t-2xl shadow-sm"
        }`}
      >
        <ToolBtn
          title="Bold"
          active={isActive("bold")}
          onClick={() => exec("bold")}
        >
          <b>B</b>
        </ToolBtn>
        <ToolBtn
          title="Italic"
          active={isActive("italic")}
          onClick={() => exec("italic")}
        >
          <i>I</i>
        </ToolBtn>
        <ToolBtn
          title="Underline"
          active={isActive("underline")}
          onClick={() => exec("underline")}
        >
          <u>U</u>
        </ToolBtn>

        <div className="w-px h-5 bg-emerald-200 mx-1" />

        <ToolBtn
          title="Heading 1"
          active={isActive("H1")}
          onClick={() => exec("formatBlock", "H1")}
        >
          H1
        </ToolBtn>
        <ToolBtn
          title="Heading 2"
          active={isActive("H2")}
          onClick={() => exec("formatBlock", "H2")}
        >
          H2
        </ToolBtn>
        <ToolBtn
          title="Heading 3"
          active={isActive("H3")}
          onClick={() => exec("formatBlock", "H3")}
        >
          H3
        </ToolBtn>

        <div className="w-px h-5 bg-emerald-200 mx-1" />

        <ToolBtn
          title="Align Left"
          active={isActive("justifyLeft")}
          onClick={() => exec("justifyLeft")}
        >
          <AlignLeft className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Align Center"
          active={isActive("justifyCenter")}
          onClick={() => exec("justifyCenter")}
        >
          <AlignCenter className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn
          title="Align Right"
          active={isActive("justifyRight")}
          onClick={() => exec("justifyRight")}
        >
          <AlignRight className="w-4 h-4" />
        </ToolBtn>

        <div className="w-px h-5 bg-emerald-200 mx-1" />

        <ToolBtn
          title="Bullet List"
          active={isActive("insertUnorderedList")}
          onClick={() => exec("insertUnorderedList")}
        >
          • List
        </ToolBtn>
        <ToolBtn
          title="Numbered List"
          active={isActive("insertOrderedList")}
          onClick={() => exec("insertOrderedList")}
        >
          1. List
        </ToolBtn>
        <ToolBtn
          title="Blockquote"
          active={isActive("BLOCKQUOTE")}
          onClick={() => exec("formatBlock", "BLOCKQUOTE")}
        >
          ❝
        </ToolBtn>

        <div className="w-px h-5 bg-emerald-200 mx-1" />

        <ToolBtn title="Link" onClick={handleLinkClick}>
          🔗
        </ToolBtn>

        <ToolBtn title="Upload Image" onClick={handleImageUploadClick}>
          🖼️
        </ToolBtn>

        <div className="w-px h-5 bg-emerald-200 mx-1" />
        <ToolBtn title="Remove formatting" onClick={handleRemoveFormat}>
          ✕
        </ToolBtn>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncContent}
        data-placeholder="Write something amazing..."
        className="min-h-[300px] p-6 focus:outline-none text-emerald-900 leading-relaxed rte-editor"
      />

      <style>{`
                .rte-editor:empty:before {
                    content: attr(data-placeholder);
                    color: #a7f3d0;
                    pointer-events: none;
                }
                .rte-editor h1 { font-size: 1.75rem; font-weight: 400; color: #064e3b; margin: 1.25rem 0 0.5rem; }
                .rte-editor h2 { font-size: 1.35rem; font-weight: 400; color: #065f46; margin: 1rem 0 0.5rem; }
                .rte-editor h3 { font-size: 1.1rem; font-weight: 400; color: #047857; margin: 0.75rem 0 0.35rem; }
                .rte-editor p { margin-bottom: 0.85rem; }
                .rte-editor ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 0.85rem; }
                .rte-editor ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 0.85rem; }
                .rte-editor blockquote { border-left: 4px solid #34d399; padding-left: 1rem; color: #065f46; font-style: normal; margin: 1rem 0; background: #f0fdf4; border-radius: 0 0.5rem 0.5rem 0; padding: 0.75rem 1rem; }
                .rte-editor a { color: #059669; text-decoration: underline; }
                .rte-editor img {
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
            `}</style>

      {/* Dynamic Pop-up for Link/Image */}
      {promptOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-emerald-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-emerald-600">
              <h3 className="text-lg font-bold text-white">{promptTitle}</h3>
            </div>
            <div className="p-5 space-y-5">
              <input
                autoFocus
                type="text"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    promptCallback(promptValue);
                    setPromptOpen(false);
                  }
                  if (e.key === "Escape") setPromptOpen(false);
                }}
                placeholder={promptPlaceholder}
                className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-900 placeholder-emerald-300 font-medium"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPromptOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    promptCallback(promptValue);
                    setPromptOpen(false);
                  }}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Confirm Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================
const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-emerald-500 text-white font-medium shadow-md shadow-emerald-500/20"
        : "text-emerald-700/70 hover:bg-emerald-50 hover:text-emerald-900 font-medium"
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? "text-white" : "text-emerald-600"}`} />
    <span>{label}</span>
  </div>
);

const StatCard = ({
  title,
  value,
  increase,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  increase: string;
  icon: any;
}) => (
  <div className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.12)] transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
        <Icon className="w-6 h-6" />
      </div>
      {increase && (
        <span className="text-sm font-semibold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
          {increase}
        </span>
      )}
    </div>
    <h3 className="text-3xl font-bold text-emerald-950 mb-1">{value}</h3>
    <p className="text-emerald-600/70 font-medium text-sm">{title}</p>
  </div>
);

// ==========================================
// DASHBOARD COMPONENT
// ==========================================
function getPageNumbers(cur: number, total: number): (number | "...")[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const p: (number | "...")[] = [];
  const a = (n: number) => {
    if (!p.includes(n)) p.push(n);
  };
  const e = () => {
    if (p[p.length - 1] !== "...") p.push("...");
  };
  a(1);
  a(2);
  if (cur > 4) e();
  for (let i = Math.max(3, cur - 1); i <= Math.min(total - 2, cur + 1); i++)
    a(i);
  if (cur < total - 3) e();
  a(total - 1);
  a(total);
  return p;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "blogs" | "quotes">(
    "overview",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPageBlogs, setCurrentPageBlogs] = useState(1);
  const [currentPageQuotes, setCurrentPageQuotes] = useState(1);
  const limit = 10;

  // Modal States
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  // Form States
  const [blogForm, setBlogForm] = useState<BlogInput>({
    title: "",
    content: "",
    cover_image: "",
    category_id: "",
  });
  const [quoteForm, setQuoteForm] = useState<QuoteInput>({ content: "" });
  const [isSaving, setIsSaving] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "danger" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const currentMainCategoryId = useMemo(() => {
    if (!blogForm.category_id) return "";
    const cat = categories.find((c) => c.id === blogForm.category_id);
    if (cat && cat.parent_id) {
      return cat.parent_id;
    }
    return blogForm.category_id;
  }, [blogForm.category_id, categories]);

  const currentSubCategories = useMemo(() => {
    if (!currentMainCategoryId) return [];
    return categories.filter((c) => c.parent_id === currentMainCategoryId);
  }, [currentMainCategoryId, categories]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedBlogs, fetchedQuotes, fetchedCategories] =
        await Promise.all([getBlogs(), getQuotes(), getCategories()]);
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
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [blogs, searchQuery]);

  const filteredQuotes = useMemo(() => {
    if (!searchQuery) return quotes;
    return quotes.filter((q) =>
      q.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [quotes, searchQuery]);

  // Pagination Computers
  const totalBlogPages = Math.ceil(filteredBlogs.length / limit) || 1;
  const paginatedBlogs = useMemo(() => {
    return filteredBlogs.slice(
      (currentPageBlogs - 1) * limit,
      currentPageBlogs * limit,
    );
  }, [filteredBlogs, currentPageBlogs]);

  const totalQuotePages = Math.ceil(filteredQuotes.length / limit) || 1;
  const paginatedQuotes = useMemo(() => {
    return filteredQuotes.slice(
      (currentPageQuotes - 1) * limit,
      currentPageQuotes * limit,
    );
  }, [filteredQuotes, currentPageQuotes]);

  // Reset pagination
  useEffect(() => {
    setCurrentPageBlogs(1);
    setCurrentPageQuotes(1);
  }, [activeTab, searchQuery]);

  // Combine for overview removed since we now use separate lists

  // ==========================================
  // ACTIONS
  // ==========================================
  const handleOpenBlogModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm({
        title: blog.title,
        content: blog.content,
        cover_image: blog.cover_image || "",
        category_id: blog.category_id || "",
      });
    } else {
      setEditingBlog(null);
      setBlogForm({ title: "", content: "", cover_image: "", category_id: "" });
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
        category_id: blogForm.category_id || null,
      };

      if (editingBlog) {
        await updateBlog(editingBlog.id, payload);
        showToast("Blog post updated successfully");
      } else {
        await createBlog(payload);
        showToast("Blog post created successfully");
      }
      setIsBlogModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving blog:", error);
      showToast("Failed to save blog post", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlog = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Blog Post?",
      message:
        "Are you sure you want to delete this blog post? This action cannot be undone and the content will be permanently removed.",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteBlog(id);
          fetchData();
          showToast("Blog post deleted successfully");
        } catch (error) {
          console.error("Error deleting blog:", error);
          showToast("Failed to delete blog post", "error");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleOpenQuoteModal = (quote?: Quote) => {
    if (quote) {
      setEditingQuote(quote);
      setQuoteForm({ content: quote.content });
    } else {
      setEditingQuote(null);
      setQuoteForm({ content: "" });
    }
    setIsQuoteModalOpen(true);
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingQuote) {
        await updateQuote(editingQuote.id, quoteForm);
        showToast("Quote updated successfully");
      } else {
        await createQuote(quoteForm);
        showToast("Quote created successfully");
      }
      setIsQuoteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving quote:", error);
      showToast("Failed to save quote", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuote = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Quote?",
      message:
        "Are you sure you want to delete this quote? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteQuote(id);
          fetchData();
          showToast("Quote deleted successfully");
        } catch (error) {
          console.error("Error deleting quote:", error);
          showToast("Failed to delete quote", "error");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Helper function to find category name
  const getCategoryName = (id: string | null) => {
    if (!id) return "Uncategorized";
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : id;
  };

  return (
    <div className="min-h-screen flex bg-emerald-50/30 relative">
      {/* Universal Slide-in Sidebar Overlay */}
      <div
        className={`fixed inset-0 min-h-screen z-50 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Slide-in Sidebar panel */}
        <div
          className={`absolute inset-y-0 left-0 w-64 bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 flex items-center justify-between border-b border-emerald-100/50">
            <span className="font-bold text-lg text-emerald-950">Menu</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <SidebarItem
              icon={Activity}
              label="Overview"
              active={activeTab === "overview"}
              onClick={() => {
                setActiveTab("overview");
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={FileText}
              label="Blogs"
              active={activeTab === "blogs"}
              onClick={() => {
                setActiveTab("blogs");
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={MessageSquareQuote}
              label="Quotes"
              active={activeTab === "quotes"}
              onClick={() => {
                setActiveTab("quotes");
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 lg:pl-12 w-full max-w-[1600px] mx-auto">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-emerald-600/80 mt-1">
                Manage your content here
              </p>
            </div>
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
                placeholder={`Search ${activeTab === "overview" ? "blogs and quotes" : activeTab}...`}
              />
            </div>
          </div>
        </header>

        {/* Stats Grid - Hidden on Overview since it has custom cards */}
        {activeTab !== "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {activeTab === "blogs" && (
              <StatCard
                title="Total Blogs"
                value={blogs.length}
                increase=""
                icon={FileText}
              />
            )}
            {activeTab === "quotes" && (
              <StatCard
                title="Total Quotes"
                value={quotes.length}
                increase=""
                icon={MessageSquareQuote}
              />
            )}
          </div>
        )}

        {/* Content Tabs Mobile */}
        <div className="flex lg:hidden gap-4 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${activeTab === "overview" ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${activeTab === "blogs" ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
          >
            Blogs
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${activeTab === "quotes" ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
          >
            Quotes
          </button>
        </div>

        {/* Dynamic Content Tracking */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent flex rounded-full animate-spin"></div>
          </div>
        ) : activeTab === "overview" ? (
          <div className="space-y-10">
            {/* Page Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-500/30">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-950 leading-tight">
                  Content Overview
                </h2>
                <p className="text-emerald-600/70 text-sm">
                  Your creative workspace at a glance
                </p>
              </div>
              {searchQuery && (
                <span className="ml-auto text-sm font-normal text-emerald-600 px-3 py-1 bg-emerald-100 rounded-full">
                  Filtering: "{searchQuery}"
                </span>
              )}
            </div>

            {/* Gradient Stat Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Blogs stat */}
              <div className="relative overflow-hidden rounded-[2rem] p-7 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -right-2 bottom-4 w-20 h-20 bg-white/5 rounded-full"></div>
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-emerald-100/80 font-semibold text-sm uppercase tracking-wider mb-2">
                      Total Blogs
                    </p>
                    <h3 className="text-5xl font-black mb-1">{blogs.length}</h3>
                    <p className="text-emerald-100/70 text-sm">
                      Published articles
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                    <FileText className="w-7 h-7" />
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("blogs")}
                  className="relative z-10 mt-6 flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white transition-colors"
                >
                  View all blogs <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quotes stat */}
              <div className="relative overflow-hidden rounded-[2rem] p-7 bg-gradient-to-br from-amber-500 via-orange-400 to-rose-400 text-white shadow-xl shadow-amber-500/30">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -right-2 bottom-4 w-20 h-20 bg-white/5 rounded-full"></div>
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-amber-100/80 font-semibold text-sm uppercase tracking-wider mb-2">
                      Total Quotes
                    </p>
                    <h3 className="text-5xl font-black mb-1">
                      {quotes.length}
                    </h3>
                    <p className="text-amber-100/70 text-sm">
                      Saved inspirations
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                    <MessageSquareQuote className="w-7 h-7" />
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("quotes")}
                  className="relative z-10 mt-6 flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white transition-colors"
                >
                  View all quotes <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Two-column feed */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Recent Blogs column */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                    <h3 className="text-lg font-bold text-emerald-950">
                      Recent Blogs
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("blogs")}
                    className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:text-emerald-800 transition-colors"
                  >
                    See all <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {filteredBlogs.length === 0 ? (
                    <div className="text-center py-12 bg-emerald-50/50 rounded-[1.5rem] border border-dashed border-emerald-200">
                      <Sparkles className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
                      <p className="text-emerald-500 font-medium text-sm">
                        No blogs yet. Create your first one!
                      </p>
                    </div>
                  ) : (
                    filteredBlogs.slice(0, 5).map((post) => (
                      <div
                        key={post.id}
                        className="group flex items-start gap-4 bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all"
                      >
                        {post.cover_image ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-emerald-50">
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-emerald-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-emerald-950 text-sm truncate group-hover:text-emerald-600 transition-colors">
                            {post.title}
                          </p>
                          <p className="text-xs text-emerald-500 mt-0.5">
                            {getCategoryName(post.category_id)}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-emerald-400">
                            <Clock className="w-3 h-3" />
                            {new Date(post.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenBlogModal(post)}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(post.id)}
                            className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Quotes column */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-6 bg-gradient-to-b from-amber-500 to-orange-400 rounded-full"></span>
                    <h3 className="text-lg font-bold text-emerald-950">
                      Recent Quotes
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("quotes")}
                    className="text-amber-600 text-sm font-semibold flex items-center gap-1 hover:text-amber-800 transition-colors"
                  >
                    See all <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {filteredQuotes.length === 0 ? (
                    <div className="text-center py-12 bg-amber-50/50 rounded-[1.5rem] border border-dashed border-amber-200">
                      <QuoteIcon className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                      <p className="text-amber-500 font-medium text-sm">
                        No quotes yet. Add your first one!
                      </p>
                    </div>
                  ) : (
                    filteredQuotes.slice(0, 5).map((q) => (
                      <div
                        key={q.id}
                        className="group relative bg-white rounded-2xl p-4 border border-amber-50 shadow-sm hover:shadow-md hover:border-amber-100 transition-all"
                      >
                        <div className="absolute top-4 left-4 text-amber-200">
                          <QuoteIcon className="w-6 h-6" />
                        </div>
                        <p className="text-emerald-800 text-sm font-medium italic leading-relaxed pl-8 pr-12 line-clamp-3">
                          {q.content}
                        </p>
                        <div className="flex items-center justify-between mt-3 pl-8">
                          <div className="flex items-center gap-1 text-xs text-emerald-400">
                            <Clock className="w-3 h-3" />
                            {new Date(q.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenQuoteModal(q)}
                              className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuote(q.id)}
                              className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "blogs" ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                All Blogs
                {searchQuery && (
                  <span className="text-sm font-normal text-emerald-600 px-3 py-1 bg-emerald-100 rounded-full">
                    Filtering by "{searchQuery}"
                  </span>
                )}
              </h2>
              <button
                onClick={() => handleOpenBlogModal()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Blog
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-emerald-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-50/50 text-emerald-800 text-sm border-b border-emerald-100">
                      <th className="py-4 px-6 font-semibold">Title</th>
                      <th className="py-4 px-6 font-semibold hidden lg:table-cell">
                        Category
                      </th>
                      <th className="py-4 px-6 font-semibold hidden sm:table-cell">
                        Date
                      </th>
                      <th className="py-4 px-6 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {paginatedBlogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-12 text-emerald-500 font-medium"
                        >
                          No blogs found.
                        </td>
                      </tr>
                    ) : (
                      paginatedBlogs.map((post, i) => (
                        <tr
                          key={post.id}
                          className={`border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors ${i === paginatedBlogs.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="py-4 px-6">
                            <span className="font-semibold text-emerald-950 block">
                              {post.title}
                            </span>
                            <span className="text-xs text-emerald-500 truncate max-w-xs block lg:hidden">
                              {getCategoryName(post.category_id)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-emerald-600 font-medium hidden lg:table-cell">
                            <span className="bg-emerald-100 py-1 px-2.5 rounded-full text-xs font-semibold">
                              {getCategoryName(post.category_id)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-emerald-600 font-medium hidden sm:table-cell">
                            {new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenBlogModal(post)}
                                className="p-2 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(post.id)}
                                className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Blog Pagination */}
            {totalBlogPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPageBlogs((p) => Math.max(1, p - 1))}
                  disabled={currentPageBlogs === 1}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPageBlogs === 1 ? "bg-emerald-50 text-emerald-300 cursor-not-allowed" : "bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md"}`}
                >
                  Previous
                </button>
                <div className="flex gap-1 flex-wrap justify-center">
                  {getPageNumbers(currentPageBlogs, totalBlogPages).map(
                    (page, idx) =>
                      page === "..." ? (
                        <span
                          key={`e${idx}`}
                          className="w-10 h-10 flex items-center justify-center text-emerald-400 font-bold"
                        >
                          &hellip;
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPageBlogs(page)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPageBlogs === page ? "bg-emerald-600 text-white shadow-md" : "bg-white text-emerald-600 hover:bg-emerald-50 shadow-sm"}`}
                        >
                          {page}
                        </button>
                      ),
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPageBlogs((p) => Math.min(totalBlogPages, p + 1))
                  }
                  disabled={currentPageBlogs === totalBlogPages}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPageBlogs === totalBlogPages ? "bg-emerald-50 text-emerald-300 cursor-not-allowed" : "bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md"}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                All Quotes
                {searchQuery && (
                  <span className="text-sm font-normal text-emerald-600 px-3 py-1 bg-emerald-100 rounded-full">
                    Filtering by "{searchQuery}"
                  </span>
                )}
              </h2>
              <button
                onClick={() => handleOpenQuoteModal()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Quote
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-emerald-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-50/50 text-emerald-800 text-sm border-b border-emerald-100">
                      <th className="py-4 px-6 font-semibold w-2/3">Content</th>
                      <th className="py-4 px-6 font-semibold hidden sm:table-cell">
                        Date
                      </th>
                      <th className="py-4 px-6 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {paginatedQuotes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-12 text-emerald-500 font-medium"
                        >
                          No quotes found.
                        </td>
                      </tr>
                    ) : (
                      paginatedQuotes.map((quote, i) => (
                        <tr
                          key={quote.id}
                          className={`border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors ${i === paginatedQuotes.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="py-4 px-6">
                            <span className="font-medium text-emerald-950 block italic text-base">
                              "{quote.content}"
                            </span>
                          </td>
                          <td className="py-4 px-6 text-emerald-600 font-medium hidden sm:table-cell">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenQuoteModal(quote)}
                                className="p-2 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuote(quote.id)}
                                className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quote Pagination */}
            {totalQuotePages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPageQuotes((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPageQuotes === 1}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPageQuotes === 1 ? "bg-emerald-50 text-emerald-300 cursor-not-allowed" : "bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md"}`}
                >
                  Previous
                </button>
                <div className="flex gap-1 flex-wrap justify-center">
                  {getPageNumbers(currentPageQuotes, totalQuotePages).map(
                    (page, idx) =>
                      page === "..." ? (
                        <span
                          key={`e${idx}`}
                          className="w-10 h-10 flex items-center justify-center text-emerald-400 font-bold"
                        >
                          &hellip;
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPageQuotes(page)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPageQuotes === page ? "bg-emerald-600 text-white shadow-md" : "bg-white text-emerald-600 hover:bg-emerald-50 shadow-sm"}`}
                        >
                          {page}
                        </button>
                      ),
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPageQuotes((p) =>
                      Math.min(totalQuotePages, p + 1),
                    )
                  }
                  disabled={currentPageQuotes === totalQuotePages}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${currentPageQuotes === totalQuotePages ? "bg-emerald-50 text-emerald-300 cursor-not-allowed" : "bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-md"}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* BLOG MODAL                                 */}
      {/* ========================================== */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-emerald-600 rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden border border-emerald-600 scrollbar-hide">
            <div className="p-6 sm:p-8 flex justify-between items-center bg-emerald-600 text-white sticky top-0 z-10 shadow-sm">
              <h2 className="text-2xl font-bold text-white">
                {editingBlog ? "Edit Blog" : "Create New Blog"}
              </h2>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-2 bg-white text-emerald-600 hover:bg-emerald-100 hover:text-emerald-900 rounded-xl transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveBlog}
              className="p-6 sm:p-8 space-y-6 bg-white rounded-b-[2rem]"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-900 ml-1">
                  Title
                </label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) =>
                    setBlogForm({ ...blogForm, title: e.target.value })
                  }
                  className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-300 transition-all font-medium"
                  placeholder="Enter blog title..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-emerald-900 ml-1">
                      Category
                    </label>
                    <select
                      value={currentMainCategoryId || ""}
                      onChange={(e) => {
                        const newMainCatId = e.target.value;
                        setBlogForm({ ...blogForm, category_id: newMainCatId });
                      }}
                      className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 transition-all font-medium appearance-none"
                      required
                    >
                      <option value="" disabled>
                        Select a category...
                      </option>
                      {categories
                        .filter((c) => !c.parent_id)
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {currentSubCategories.length > 0 && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-sm font-semibold text-emerald-900 ml-1">
                        Subcategory
                      </label>
                      <select
                        value={
                          blogForm.category_id === currentMainCategoryId
                            ? ""
                            : blogForm.category_id || ""
                        }
                        onChange={(e) =>
                          setBlogForm({
                            ...blogForm,
                            category_id: e.target.value,
                          })
                        }
                        className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 transition-all font-medium appearance-none"
                        required
                      >
                        <option value="" disabled>
                          Select specific category...
                        </option>
                        {currentSubCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-emerald-900 ml-1">
                    Cover Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={blogForm.cover_image || ""}
                      onChange={(e) =>
                        setBlogForm({
                          ...blogForm,
                          cover_image: e.target.value,
                        })
                      }
                      className="flex-1 min-w-0 bg-emerald-50/30 border border-emerald-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-300 transition-all font-medium"
                      placeholder="https://... or click Upload"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadImage(file, "covers");
                            setBlogForm((prev) => ({
                              ...prev,
                              cover_image: url,
                            }));
                          } catch (err: any) {
                            console.error(err);
                            alert(
                              "Upload cover failed: " +
                                (err.message || "Unknown error"),
                            );
                          }
                        };
                        input.click();
                      }}
                      className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 font-semibold shadow-sm shrink-0 transition-colors"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-900 ml-1">
                  Content
                </label>
                <RichTextEditor
                  value={blogForm.content}
                  onChange={(content) => setBlogForm({ ...blogForm, content })}
                />
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
                  {isSaving ? (
                    <Activity className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {editingBlog ? "Save Changes" : "Create Blog"}
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
          <div className="bg-emerald-600 rounded-[2rem] shadow-2xl w-full max-w-xl border border-emerald-600 overflow-hidden">
            <div className="p-6 sm:p-8 flex justify-between items-center bg-emerald-600 text-white">
              <h2 className="text-2xl font-bold text-white">
                {editingQuote ? "Edit Quote" : "Create New Quote"}
              </h2>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="p-2 bg-white text-emerald-600 hover:bg-emerald-100 hover:text-emerald-900 rounded-xl transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveQuote}
              className="p-6 sm:p-8 space-y-6 bg-white rounded-b-[2rem]"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-900 ml-1">
                  Quote Content
                </label>
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
                  {isSaving ? (
                    <Activity className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {editingQuote ? "Save Changes" : "Create Quote"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================== */}
      {/* CONFIRMATION MODAL                         */}
      {/* ========================================== */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md border border-emerald-50 overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  confirmModal.type === "danger"
                    ? "bg-rose-50 text-rose-500"
                    : "bg-amber-50 text-amber-500"
                }`}
              >
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-3">
                {confirmModal.title}
              </h3>
              <p className="text-emerald-600/70 font-medium">
                {confirmModal.message}
              </p>
            </div>
            <div className="flex gap-3 p-6 bg-emerald-50/50 border-t border-emerald-50">
              <button
                onClick={() =>
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                }
                className="flex-1 py-3 px-4 rounded-xl font-bold text-emerald-700 bg-white border border-emerald-100 hover:bg-emerald-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                  confirmModal.type === "danger"
                    ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                }`}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================== */}
      {/* TOAST NOTIFICATION                         */}
      {/* ========================================== */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 transform ${
          toast.show
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`px-6 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 min-w-[320px] backdrop-blur-md border ${
            toast.type === "success"
              ? "bg-emerald-600/90 text-white border-emerald-400/30"
              : "bg-rose-600/90 text-white border-rose-400/30"
          }`}
        >
          <div className="p-1.5 bg-white/20 rounded-full">
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          <p className="font-bold tracking-tight">{toast.message}</p>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, type ChangeEvent } from 'preact/hooks';
import { marked } from 'marked';
import { resizeToWebp } from '@/lib/image';

interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialExcerpt?: string;
  initialStatus?: 'draft' | 'published';
  initialPublishedAt?: string | null;
  postId?: number;
}

export default function MarkdownEditor({
  initialTitle = '',
  initialContent = '',
  initialExcerpt = '',
  initialStatus = 'draft',
  initialPublishedAt = null,
  postId,
}: MarkdownEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);
  const [publishedAt, setPublishedAt] = useState(initialPublishedAt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-çğıöşü]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
      setSlug(newSlug);
    }
  }, [title, slugManuallyEdited]);

  // Generate slug on first load
  useEffect(() => {
    if (!postId && !slug && initialTitle) {
      const newSlug = initialTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-çğıöşü]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
      setSlug(newSlug);
    }
  }, [postId, slug, initialTitle]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugManuallyEdited(true);
  };

  const resetSlug = () => {
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-çğıöşü]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '')
      .substring(0, 60);
    setSlug(newSlug);
    setSlugManuallyEdited(false);
  };

  const handleImageUpload = async (file: File) => {
    try {
      // Resize to webp
      const webpBlob = await resizeToWebp(file);

      // Upload via API
      const formData = new FormData();
      formData.append('file', webpBlob);
      formData.append('type', 'blog');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Insert markdown image syntax
      const imageMarkdown = `![${file.name}](${data.url})`;
      setContent((prev) => `${prev}\n${imageMarkdown}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleImageUpload(file);
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          await handleImageUpload(file);
          break;
        }
      }
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = postId ? `/api/admin/posts/${postId}` : '/api/admin/posts';
      const method = postId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content_markdown: content,
          excerpt: excerpt || null,
          status,
          published_at: status === 'published' ? (publishedAt || new Date().toISOString()) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save post');
      }

      window.location.href = '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as 'draft' | 'published');
    if (e.target.value === 'published' && !publishedAt) {
      setPublishedAt(new Date().toISOString());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onDrop={handleDrop}
      onPaste={handlePaste}
      class="space-y-6"
    >
      {/* Error message */}
      {error && (
        <div class="border border-red-500/50 bg-red-500/10 text-red-500 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" class="block text-sm text-faint mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Post title..."
          class="w-full px-4 py-2 border border-color rounded bg-base text-ink placeholder:faint focus:outline-none focus:border-mauve"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" class="block text-sm text-faint mb-2">
          Slug
        </label>
        <div class="flex gap-2">
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={handleSlugChange}
            placeholder="auto-generated from title"
            class="flex-1 px-4 py-2 border border-color rounded bg-base text-ink placeholder:faint focus:outline-none focus:border-mauve font-mono text-sm"
          />
          <button
            type="button"
            onClick={resetSlug}
            class="px-3 py-2 border border-color rounded text-sm hover:bg-surface transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" class="block text-sm text-faint mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          class="w-full px-4 py-2 border border-color rounded bg-base text-ink focus:outline-none focus:border-mauve font-mono text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Published At */}
      {status === 'published' && (
        <div>
          <label htmlFor="publishedAt" class="block text-sm text-faint mb-2">
            Published At
          </label>
          <input
            id="publishedAt"
            type="datetime-local"
            value={publishedAt ? new Date(publishedAt).toISOString().slice(0, 16) : ''}
            onChange={(e) => setPublishedAt(new Date(e.target.value).toISOString())}
            class="w-full px-4 py-2 border border-color rounded bg-base text-ink focus:outline-none focus:border-mauve font-mono text-sm"
          />
        </div>
      )}

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" class="block text-sm text-faint mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief excerpt..."
          rows={2}
          class="w-full px-4 py-2 border border-color rounded bg-base text-ink placeholder:faint focus:outline-none focus:border-mauve resize-none"
        />
      </div>

      {/* Markdown Editor + Preview */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editor */}
        <div>
          <label htmlFor="content" class="block text-sm text-faint mb-2">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post in Markdown..."
            class="w-full h-96 px-4 py-2 border border-color rounded bg-base text-ink placeholder:faint focus:outline-none focus:border-mauve resize-none font-mono text-sm"
          />
          <p class="text-xs text-faint mt-2">
            Drag & drop or paste images to upload
          </p>
        </div>

        {/* Preview */}
        <div>
          <label class="block text-sm text-faint mb-2">Preview</label>
          <div
            class="h-96 px-4 py-2 border border-color rounded bg-base overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div class="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          class="px-6 py-2 bg-mauve text-base rounded hover:bg-mauve/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : postId ? 'Update' : 'Publish'}
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = '/admin')}
          class="px-6 py-2 border border-color rounded hover:bg-surface transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
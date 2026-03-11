'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Snippet, SnippetType } from '@/types';
import { snippetsApi, getApiErrorMessage } from '@/lib/api';

interface SnippetFormProps {
  initialData?: Snippet;
  mode: 'create' | 'edit';
}

interface FormErrors {
  title?: string;
  content?: string;
  type?: string;
  api?: string;
}

const TYPES: { value: SnippetType; label: string; desc: string }[] = [
  { value: 'note', label: '📝 Note', desc: 'Plain text note or documentation' },
  { value: 'link', label: '🔗 Link', desc: 'URL or web resource' },
  { value: 'command', label: '⚡ Command', desc: 'CLI command or script' },
];

export function SnippetForm({ initialData, mode }: SnippetFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    content: initialData?.content ?? '',
    tags: initialData?.tags.join(', ') ?? '',
    type: initialData?.type ?? ('note' as SnippetType),
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.trim().length > 200) newErrors.title = 'Title must be at most 200 characters';
    if (!form.content.trim()) newErrors.content = 'Content is required';
    if (!form.type) newErrors.type = 'Type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    const tags = form.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      if (mode === 'create') {
        const created = await snippetsApi.create({
          title: form.title.trim(),
          content: form.content.trim(),
          tags,
          type: form.type,
        });
        router.push(`/snippets/${created._id}`);
      } else {
        await snippetsApi.update(initialData!._id, {
          title: form.title.trim(),
          content: form.content.trim(),
          tags,
          type: form.type,
        });
        router.push(`/snippets/${initialData!._id}`);
      }
    } catch (err) {
      setErrors({ api: getApiErrorMessage(err) });
      setLoading(false);
    }
  };

  const inputStyle = (hasError?: string) => ({
    background: 'var(--surface)',
    border: `1px solid ${hasError ? '#ef4444' : 'var(--border)'}`,
    color: 'var(--text)',
    borderRadius: '8px',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  });

  return (
    <div className="space-y-6">
      {errors.api && (
        <div
          className="px-4 py-3 rounded-lg text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
        >
          {errors.api}
        </div>
      )}

      {/* Type selector */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dim)' }}>
          Type <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: t.value }))}
              className="p-3 rounded-lg text-left transition-all"
              style={{
                background: form.type === t.value ? 'var(--accent-glow)' : 'var(--surface)',
                border: `1px solid ${form.type === t.value ? 'var(--accent)' : 'var(--border)'}`,
                color: form.type === t.value ? 'var(--accent)' : 'var(--dim)',
              }}
            >
              <div className="text-sm font-semibold">{t.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--dim)', opacity: 0.8 }}>{t.desc}</div>
            </button>
          ))}
        </div>
        {errors.type && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.type}</p>}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dim)' }}>
          Title <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="e.g. Docker cleanup command"
          style={inputStyle(errors.title)}
          onFocus={(e) => { if (!errors.title) (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'; }}
          onBlur={(e) => { if (!errors.title) (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }}
        />
        {errors.title && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.title}</p>}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dim)' }}>
          Content <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder={
            form.type === 'link'
              ? 'https://example.com'
              : form.type === 'command'
              ? 'docker system prune -af --volumes'
              : 'Write your note here...'
          }
          rows={6}
          style={{
            ...inputStyle(errors.content),
            resize: 'vertical',
            fontFamily: form.type === 'command' ? "'JetBrains Mono', monospace" : 'inherit',
          }}
          onFocus={(e) => { if (!errors.content) (e.target as HTMLTextAreaElement).style.borderColor = 'var(--accent)'; }}
          onBlur={(e) => { if (!errors.content) (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'; }}
        />
        {errors.content && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.content}</p>}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dim)' }}>
          Tags <span className="text-xs font-normal" style={{ color: 'var(--dim)', opacity: 0.6 }}>(comma separated)</span>
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          placeholder="docker, devops, cleanup"
          style={{ ...inputStyle(), fontFamily: "'JetBrains Mono', monospace" }}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'; }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--dim)', opacity: 0.6 }}>
          Tags are automatically lowercased
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {loading ? 'Saving…' : mode === 'create' ? 'Create Snippet' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
          style={{ background: 'var(--muted)', color: 'var(--dim)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

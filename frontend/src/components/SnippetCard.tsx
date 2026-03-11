'use client';

import Link from 'next/link';
import { Snippet } from '@/types';

const TYPE_CONFIG = {
  link: { label: '🔗 Link', className: 'badge-link' },
  note: { label: '📝 Note', className: 'badge-note' },
  command: { label: '⚡ Command', className: 'badge-command' },
};

interface SnippetCardProps {
  snippet: Snippet;
  onDelete?: (id: string) => void;
}

export function SnippetCard({ snippet, onDelete }: SnippetCardProps) {
  const typeConfig = TYPE_CONFIG[snippet.type];
  const date = new Date(snippet.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="group rounded-xl p-5 transition-all duration-200 hover:translate-y-[-1px] animate-slide-up"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 1px var(--accent-glow), 0 4px 16px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${typeConfig.className}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {typeConfig.label}
          </span>
        </div>
        <span className="text-xs shrink-0" style={{ color: 'var(--dim)' }}>
          {date}
        </span>
      </div>

      <Link href={`/snippets/${snippet._id}`} className="block group/title mb-2">
        <h3
          className="text-base font-semibold leading-snug transition-colors"
          style={{ color: 'var(--text)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
        >
          {snippet.title}
        </h3>
      </Link>

      <p
        className="text-sm leading-relaxed mb-4 line-clamp-2"
        style={{ color: 'var(--dim)' }}
      >
        {snippet.type === 'command' ? (
          <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
            {snippet.content}
          </code>
        ) : (
          snippet.content
        )}
      </p>

      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {snippet.tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className="text-xs px-2 py-0.5 rounded-md transition-all"
              style={{
                background: 'var(--muted)',
                color: 'var(--dim)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--accent-glow)';
                (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--muted)';
                (e.currentTarget as HTMLElement).style.color = 'var(--dim)';
              }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          href={`/snippets/${snippet._id}`}
          className="text-xs font-medium transition-colors"
          style={{ color: 'var(--accent)' }}
        >
          View details →
        </Link>
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(snippet._id);
            }}
            className="text-xs px-2 py-1 rounded transition-all opacity-0 group-hover:opacity-100"
            style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

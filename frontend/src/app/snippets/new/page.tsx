import { SnippetForm } from '@/components/SnippetForm';
import Link from 'next/link';

export default function NewSnippetPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm mb-4 inline-flex items-center gap-1 transition-colors"
          style={{ color: 'var(--dim)' }}
        >
          ← Back to list
        </Link>
        <h1 className="text-2xl font-bold mt-3" style={{ color: 'var(--text)', fontFamily: "'Syne', sans-serif" }}>
          New Snippet
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--dim)' }}>
          Save a link, note, or command for later
        </p>
      </div>

      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <SnippetForm mode="create" />
      </div>
    </div>
  );
}

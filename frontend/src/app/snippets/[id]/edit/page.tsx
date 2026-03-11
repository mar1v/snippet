'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Snippet } from '@/types';
import { snippetsApi, getApiErrorMessage } from '@/lib/api';
import { SnippetForm } from '@/components/SnippetForm';

interface PageProps {
  params: { id: string };
}

export default function EditSnippetPage({ params }: PageProps) {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    snippetsApi
      .getById(params.id)
      .then(setSnippet)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-4 rounded w-24" style={{ background: 'var(--muted)' }} />
        <div className="h-8 rounded w-1/2" style={{ background: 'var(--surface)' }} />
        <div className="h-64 rounded" style={{ background: 'var(--surface)' }} />
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <p className="text-sm mb-3" style={{ color: '#fca5a5' }}>{error || 'Snippet not found'}</p>
          <Link href="/" className="text-xs" style={{ color: 'var(--dim)' }}>← Back to list</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/snippets/${snippet._id}`}
          className="text-sm inline-flex items-center gap-1 mb-4 transition-colors"
          style={{ color: 'var(--dim)' }}
        >
          ← Back to snippet
        </Link>
        <h1 className="text-2xl font-bold mt-3" style={{ color: 'var(--text)', fontFamily: "'Syne', sans-serif" }}>
          Edit Snippet
        </h1>
        <p className="text-sm mt-1 truncate" style={{ color: 'var(--dim)' }}>
          {snippet.title}
        </p>
      </div>

      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <SnippetForm mode="edit" initialData={snippet} />
      </div>
    </div>
  );
}

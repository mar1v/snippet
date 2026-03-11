'use client';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--dim)' }}
      >
        ← Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="w-8 h-8 rounded-lg text-sm font-medium transition-all"
          style={{
            background: p === page ? 'var(--accent)' : 'var(--surface)',
            border: `1px solid ${p === page ? 'var(--accent)' : 'var(--border)'}`,
            color: p === page ? '#fff' : 'var(--dim)',
          }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--dim)' }}
      >
        Next →
      </button>
    </div>
  );
}

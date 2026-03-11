"use client";

import { getApiErrorMessage, snippetsApi } from "@/lib/api";
import { Snippet } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TYPE_CONFIG = {
  link: { label: "🔗 Link", className: "badge-link" },
  note: { label: "📝 Note", className: "badge-note" },
  command: { label: "⚡ Command", className: "badge-command" },
};

interface PageProps {
  params: { id: string };
}

export default function SnippetDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    snippetsApi
      .getById(params.id)
      .then(setSnippet)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleCopy = async () => {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet.content);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this snippet? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await snippetsApi.delete(params.id);
      router.push("/");
    } catch (err) {
      alert(getApiErrorMessage(err));
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div
            className="h-4 rounded w-24"
            style={{ background: "var(--muted)" }}
          />
          <div
            className="h-8 rounded w-3/4"
            style={{ background: "var(--surface)" }}
          />
          <div
            className="h-40 rounded"
            style={{ background: "var(--surface)" }}
          />
        </div>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div className="text-3xl mb-3">😞</div>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: "#fca5a5" }}
          >
            Snippet not found
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--dim)" }}>
            {error || "This snippet may have been deleted."}
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--muted)", color: "var(--dim)" }}
          >
            ← Back to list
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = TYPE_CONFIG[snippet.type];
  const createdAt = new Date(snippet.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const updatedAt = new Date(snippet.updatedAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link
        href="/"
        className="text-sm inline-flex items-center gap-1 mb-6 transition-colors"
        style={{ color: "var(--dim)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = "var(--dim)";
        }}
      >
        ← All Snippets
      </Link>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="px-6 pt-6 pb-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${typeConfig.className}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {typeConfig.label}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/snippets/${snippet._id}/edit`}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: "var(--muted)",
                  color: "var(--dim)",
                  border: "1px solid var(--border)",
                }}
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  color: "#fca5a5",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--text)", fontFamily: "'Syne', sans-serif" }}
          >
            {snippet.title}
          </h1>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--dim)" }}
            >
              Content
            </span>
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1 rounded-lg transition-all"
              style={{
                background: copying ? "rgba(74,222,128,0.1)" : "var(--muted)",
                color: copying ? "#4ade80" : "var(--dim)",
                border: `1px solid ${copying ? "rgba(74,222,128,0.3)" : "transparent"}`,
              }}
            >
              {copying ? "✓ Copied" : "Copy"}
            </button>
          </div>

          {snippet.type === "command" ? (
            <pre
              className="text-sm p-4 rounded-lg overflow-x-auto"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--cmd-color)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <code>{snippet.content}</code>
            </pre>
          ) : snippet.type === "link" ? (
            <div
              className="p-4 rounded-lg"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
              }}
            >
              <a
                href={snippet.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm break-all transition-colors"
                style={{ color: "var(--link-color)" }}
              >
                {snippet.content}
              </a>
            </div>
          ) : (
            <div
              className="p-4 rounded-lg"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--text)" }}
              >
                {snippet.content}
              </p>
            </div>
          )}
        </div>

        {snippet.tags.length > 0 && (
          <div className="px-6 pb-5">
            <span
              className="text-xs font-semibold block mb-2"
              style={{ color: "var(--dim)" }}
            >
              Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {snippet.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="text-xs px-2 py-0.5 rounded-md transition-all"
                  style={{
                    background: "var(--muted)",
                    color: "var(--dim)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div
          className="px-6 py-4 flex flex-col sm:flex-row gap-2 text-xs"
          style={{ borderTop: "1px solid var(--border)", color: "var(--dim)" }}
        >
          <span>Created: {createdAt}</span>
          {createdAt !== updatedAt && (
            <span className="hidden sm:block">·</span>
          )}
          {createdAt !== updatedAt && <span>Updated: {updatedAt}</span>}
        </div>
      </div>
    </div>
  );
}

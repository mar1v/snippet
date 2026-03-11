"use client";

import { Pagination } from "@/components/Pagination";
import { SnippetCard } from "@/components/SnippetCard";
import { getApiErrorMessage, snippetsApi } from "@/lib/api";
import { Snippet } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  const q = searchParams.get("q") || "";
  const tag = searchParams.get("tag") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(q);

  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await snippetsApi.getAll({
        q: q || undefined,
        tag: tag || undefined,
        page,
        limit: 9,
      });
      setSnippets(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [q, tag, page]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  useEffect(() => {
    snippetsApi
      .getTags()
      .then(setAllTags)
      .catch(() => {});
  }, []);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = () => {
    updateParams({ q: searchInput });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this snippet?")) return;
    try {
      await snippetsApi.delete(id);
      fetchSnippets();
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: "var(--text)", fontFamily: "'Syne', sans-serif" }}
        >
          Your Snippets
        </h1>
        <p className="text-sm" style={{ color: "var(--dim)" }}>
          {total > 0
            ? `${total} snippet${total !== 1 ? "s" : ""} stored`
            : "No snippets yet"}
        </p>
      </div>

      <div
        className="rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search snippets…"
            className="flex-1 px-4 py-2 rounded-lg text-sm"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Search
          </button>
          {q && (
            <button
              onClick={() => {
                setSearchInput("");
                updateParams({ q: "" });
              }}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--muted)", color: "var(--dim)" }}
            >
              ✕
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs" style={{ color: "var(--dim)" }}>
              Tags:
            </span>
            {allTags.slice(0, 8).map((t) => (
              <button
                key={t}
                onClick={() => updateParams({ tag: tag === t ? "" : t })}
                className="text-xs px-2 py-1 rounded-md transition-all"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  background: tag === t ? "var(--accent-glow)" : "var(--muted)",
                  color: tag === t ? "var(--accent)" : "var(--dim)",
                  border: `1px solid ${tag === t ? "var(--accent)" : "transparent"}`,
                }}
              >
                #{t}
              </button>
            ))}
            {tag && (
              <button
                onClick={() => updateParams({ tag: "" })}
                className="text-xs px-2 py-1 rounded-md"
                style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {(q || tag) && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {q && (
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: "var(--accent-glow)",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
              }}
            >
              Search: &quot;{q}&quot;
            </span>
          )}
          {tag && (
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: "var(--muted)",
                color: "var(--dim)",
                border: "1px solid var(--border)",
              }}
            >
              Tag: #{tag}
            </span>
          )}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl p-5 animate-pulse"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                height: "180px",
              }}
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div
          className="rounded-xl p-6 text-center"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: "#fca5a5" }}>
            Failed to load snippets
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--dim)" }}>
            {error}
          </p>
          <button
            onClick={fetchSnippets}
            className="text-xs px-4 py-2 rounded-lg"
            style={{ background: "var(--muted)", color: "var(--dim)" }}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && snippets.length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{
            background: "var(--surface)",
            border: "1px dashed var(--border)",
          }}
        >
          <div className="text-4xl mb-4">📭</div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text)" }}
          >
            {q || tag ? "No snippets found" : "No snippets yet"}
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
            {q || tag
              ? "Try adjusting your search or filters"
              : "Create your first snippet to get started"}
          </p>
          {!q && !tag && (
            <a
              href="/snippets/new"
              className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              + Create Snippet
            </a>
          )}
        </div>
      )}

      {!loading && !error && snippets.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(p));
              router.push(`/?${params.toString()}`);
            }}
          />
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl p-5 animate-pulse"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                height: "180px",
              }}
            />
          ))}
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

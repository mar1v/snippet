import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snippet Vault",
  description: "Save and organize your code snippets, links, and notes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen" style={{ background: "var(--bg)" }}>
          <header
            style={{
              borderBottom: "1px solid var(--border)",
              background: "var(--surface)",
            }}
            className="sticky top-0 z-50"
          >
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 group">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  SV
                </div>
                <span
                  className="text-lg font-bold tracking-tight"
                  style={{
                    color: "var(--text)",
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  Snippet Vault
                </span>
              </a>
              <a
                href="/snippets/new"
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                + New Snippet
              </a>
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}

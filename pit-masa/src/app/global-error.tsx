"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#FBF9F4", color: "#14141A", fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <h1 style={{ color: "#ef4444" }}>Something went wrong</h1>
        <p style={{ color: "#fbbf24", fontSize: "0.875rem", marginTop: "1rem" }}>
          <strong>Error:</strong> {error?.message || "Unknown error"}
        </p>
        <pre style={{
          color: "#94a3b8",
          fontSize: "0.75rem",
          marginTop: "0.5rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          maxHeight: "40vh",
          overflow: "auto",
          background: "#1e1e1e",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}>
          {error?.stack || "No stack trace available"}
        </pre>
        {error?.digest && (
          <p style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.5rem" }}>
            Digest: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 2rem",
            backgroundColor: "#C68A17",
            color: "#fff",
            border: "none",
            borderRadius: "9999px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}

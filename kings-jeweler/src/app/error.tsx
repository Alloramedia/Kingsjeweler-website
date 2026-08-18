"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FBF9F4]">
      <div className="mx-auto max-w-lg px-6 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-3xl tracking-tight text-[#14141A] md:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#14141A]/65">
          We ran into an unexpected error. Please try again, or get in touch if
          the problem persists.
        </p>
        <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-[#1e1e1e] p-4 text-left text-xs text-yellow-400 break-all whitespace-pre-wrap">
          {error?.message || "Unknown error"}
          {"\n\n"}
          {error?.stack || "No stack trace"}
        </pre>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="btn-gold inline-flex items-center px-8 py-4 text-base font-bold text-white hover:scale-[1.03]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-sm border-2 border-[#14141A]/20 px-8 py-4 text-base font-bold text-[#14141A] transition-all duration-300 hover:border-[#C68A17] hover:bg-[#C68A17]/10"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

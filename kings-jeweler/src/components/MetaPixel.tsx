"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("cookie-consent-change", callback);
  return () => window.removeEventListener("cookie-consent-change", callback);
}

function getSnapshot() {
  // Opt-out model: the pixel is enabled unless the user explicitly declines.
  try {
    return localStorage.getItem("cookie-consent") !== "declined";
  } catch {
    return true;
  }
}

function getServerSnapshot() {
  return true;
}

/** Bootstrap the pixel from JS — used when consent is granted after initial
 *  page load (the inline snippet skipped itself for a declined visitor). */
function loadPixel(pixelId: string) {
  if (window.fbq) return;
  const queue: unknown[][] = [];
  const stub = ((...args: unknown[]) => {
    queue.push(args);
  }) as ((...args: unknown[]) => void) & {
    queue: unknown[][];
    push: unknown;
    loaded: boolean;
    version: string;
  };
  stub.queue = queue;
  stub.push = stub;
  stub.loaded = true;
  stub.version = "2.0";
  window.fbq = stub;
  window._fbq = stub;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

/**
 * Meta (Facebook) Pixel loader. Mirrors <ConsentGoogleAnalytics />: enabled
 * by default (opt-out model), disabled when the visitor clicks "Decline" on
 * the cookie banner. Fires PageView on load and on SPA route changes.
 *
 * The base snippet is emitted as raw HTML (dangerouslySetInnerHTML wrapper,
 * not a React <script> element) so that (a) it's present in the
 * server-rendered HTML for Meta's no-JS pixel detector, (b) the browser
 * executes it on parse, and (c) React 19 doesn't warn about client-rendered
 * script tags. The consent check lives inside the snippet itself, so a
 * previously-declined visitor never loads the pixel.
 */
export function MetaPixel({ pixelId }: { pixelId: string }) {
  const allowed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // SPA navigations — the base snippet already fires the initial PageView.
  useEffect(() => {
    if (!allowed || !window.fbq) return;
    if (lastPath.current === null || lastPath.current === pathname) {
      lastPath.current = pathname;
      return;
    }
    lastPath.current = pathname;
    window.fbq("track", "PageView");
  }, [pathname, allowed]);

  // Consent changes after load: revoke on decline, re-grant on accept, and
  // bootstrap the pixel if the inline snippet skipped itself at page load.
  useEffect(() => {
    if (!window.fbq) {
      if (allowed) loadPixel(pixelId);
      return;
    }
    window.fbq("consent", allowed ? "grant" : "revoke");
  }, [allowed, pixelId]);

  const snippet = `<script>(function(){try{if(localStorage.getItem('cookie-consent')==='declined')return;}catch(e){}!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(pixelId)});fbq('track','PageView');})()</script>`;

  return (
    <>
      <span
        style={{ display: "none" }}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: snippet }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

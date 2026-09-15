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

/**
 * Meta (Facebook) Pixel loader. Mirrors <ConsentGoogleAnalytics />: rendered
 * by default (opt-out model) and disabled when the visitor clicks "Decline"
 * on the cookie banner. Fires PageView on load and on SPA route changes.
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

  // If the user declines after the script has loaded, revoke consent so the
  // pixel stops sending data (and re-grant if they later accept).
  useEffect(() => {
    if (!window.fbq) return;
    window.fbq("consent", allowed ? "grant" : "revoke");
  }, [allowed]);

  if (!allowed) return null;

  return (
    <>
      {/* Plain script (not next/script) so the base code is present in the
          server-rendered HTML — Meta's pixel detector crawls without JS.
          React does not re-execute inline scripts on hydration. */}
      <script
        id="meta-pixel"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(pixelId)});fbq('track','PageView');`,
        }}
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

"use client";

import { useLayoutEffect, useRef, useState } from "react";

declare global {
  interface Window {
    __dktHomeIntroPlayedInDocument?: boolean;
  }
}

function isInitialHomeDocumentLoad() {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

  if (!navigation?.name) {
    return true;
  }

  return new URL(navigation.name).pathname === window.location.pathname;
}

const mobileFrameSources = Array.from({ length: 12 }, (_, index) => `/images/intro/mobile-sequence/frame-${String(index + 1).padStart(2, "0")}.png`);

export function HomeIntroAnimation() {
  const [isMounted, setIsMounted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    if (window.__dktHomeIntroPlayedInDocument || !isInitialHomeDocumentLoad()) {
      setIsMounted(false);
      return;
    }

    window.__dktHomeIntroPlayedInDocument = true;
    void videoRef.current?.play().catch(() => undefined);

    const timer = window.setTimeout(() => setIsMounted(false), 5400);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="home-intro home-intro--video" aria-hidden="true">
      <div className="home-intro__mobile-fallback">
        {mobileFrameSources.map((src) => (
          <img className="home-intro__mobile-preload" src={src} alt="" key={src} />
        ))}
      </div>
      <video
        className="home-intro__video"
        ref={videoRef}
        src="/videos/intro/opening-race.mp4?v=20260628a"
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => void videoRef.current?.play().catch(() => undefined)}
        onError={() => setIsMounted(false)}
      />
    </div>
  );
}

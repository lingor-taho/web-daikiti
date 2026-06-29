"use client";

import { useEffect, useRef, useState } from "react";

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

export function HomeIntroAnimation() {
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.__dktHomeIntroPlayedInDocument || !isInitialHomeDocumentLoad()) {
      return;
    }

    window.__dktHomeIntroPlayedInDocument = true;
    setIsMounted(true);

    const timer = window.setTimeout(() => setIsMounted(false), 5400);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="home-intro home-intro--video" aria-hidden="true">
      <video
        className="home-intro__video"
        ref={videoRef}
        src="/videos/intro/opening-race.mp4?v=20260628a"
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => void videoRef.current?.play().catch(() => undefined)}
        onEnded={() => setIsMounted(false)}
        onError={() => setIsMounted(false)}
        onLoadedMetadata={() => {
          if (videoRef.current && videoRef.current.currentTime < 0.35) {
            videoRef.current.currentTime = 0.35;
          }
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export function HomeIntroAnimation() {
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
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
        src="/videos/intro/opening-race.mp4?v=20260628a"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setIsMounted(false)}
        onError={() => setIsMounted(false)}
      />
    </div>
  );
}

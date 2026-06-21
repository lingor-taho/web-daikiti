"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    src: "/images/original-site/site-hero.jpg",
    alt: "DKT MOTORS 店舗外観",
    label: "DKT MOTORS",
    title: "販売・輸出・カスタムを一つの窓口で。",
    lead: "中古車販売と輸出を軸に、用途や予算に合わせたカスタム提案まで一貫して対応します。",
    primaryHref: "/custom-works",
    primaryLabel: "カスタム事例を見る",
    secondaryHref: "/contact",
    secondaryLabel: "お問い合わせ",
    variant: "fade-up",
  },
  {
    src: "/images/original-site/auto-service.jpeg",
    alt: "自動車整備の作業風景",
    label: "TOTAL CAR SERVICE",
    title: "仕入れから整備まで、安心して任せられる体制。",
    lead: "販売、メンテナンス、修理、輸出まで。お客様のカーライフと事業利用を幅広く支えます。",
    primaryHref: "/company",
    primaryLabel: "会社情報へ",
    secondaryHref: "/contact",
    secondaryLabel: "相談する",
    variant: "slide-right",
  },
  {
    src: "/images/custom-works/jimny-offroad-after.png",
    alt: "オフロード仕様のカスタム車両",
    label: "CUSTOM WORKS",
    title: "使い方に合わせて、印象に残る一台へ。",
    lead: "アウトドア、業務利用、ドレスアップなど、車種ごとの特徴を活かした改装事例を紹介します。",
    primaryHref: "/custom-works",
    primaryLabel: "最新カスタムを見る",
    secondaryHref: "/contact",
    secondaryLabel: "改装を相談する",
    variant: "stagger",
  },
];

export function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  };

  const activeSlide = heroSlides[activeIndex];

  return (
    <section className="home-hero" aria-label="DKT MOTORS メインビジュアル">
      <div className="home-hero__slides" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <div className={index === activeIndex ? "home-hero__slide is-active" : "home-hero__slide"} key={slide.src}>
            <Image src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="100vw" />
          </div>
        ))}
      </div>
      <div className="home-hero__shade" />
      <button className="home-hero__arrow home-hero__arrow--prev" type="button" onClick={showPrevious} aria-label="前の画像">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M15 5 8 12l7 7" />
        </svg>
      </button>
      <button className="home-hero__arrow home-hero__arrow--next" type="button" onClick={showNext} aria-label="次の画像">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>
      <div className={`container home-hero__content home-hero__content--${activeSlide.variant}`}>
        <div className="home-hero__copy" key={activeSlide.src}>
          <p className="home-hero__label">{activeSlide.label}</p>
          <h1>{activeSlide.title}</h1>
          <p className="home-hero__lead">{activeSlide.lead}</p>
          <div className="button-row">
            <Link className="button button--accent" href={activeSlide.primaryHref}>
              {activeSlide.primaryLabel}
            </Link>
            <Link className="button button--ghost" href={activeSlide.secondaryHref}>
              {activeSlide.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
      <div className="home-hero__contact-strip">
        <div className="container home-hero__contact-inner">
          <span>自動車販売・輸出・カスタムのご相談はこちら</span>
          <a href="tel:0722848938">072-284-8938</a>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="home-hero">
      <div className="container home-hero__grid">
        <div className="home-hero__content">
          <h1>自動車トータルサービスと改装で、車の価値を引き出す。</h1>
          <p className="home-hero__lead">
            DKT Motorsは中古車販売、買取、輸出、そして自動車改装まで幅広く対応するカーライフパートナーです。確かなサービスと施工事例で、お客様の一台にふさわしい提案を行います。
          </p>
          <div className="button-row">
            <Link className="button button--accent" href="/custom-works">
              改装事例を見る
            </Link>
            <Link className="button button--ghost" href="/contact">
              お問い合わせ
            </Link>
          </div>
        </div>
        <div className="home-hero__media" aria-label="DKT Motors custom vehicle visual">
          <Image
            src="/images/placeholders/custom-case-1.svg"
            alt=""
            fill
            priority
            sizes="(max-width: 920px) 100vw, 52vw"
          />
        </div>
      </div>
    </section>
  );
}

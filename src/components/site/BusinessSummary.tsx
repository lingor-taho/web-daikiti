import Image from "next/image";
import Link from "next/link";

const businesses = [
  {
    label: "自動車トータルサービス事業",
    title: "販売からメンテナンス、輸出、カスタムまで幅広くサポート",
    body: "当社は、自動車に関する幅広いサービスを提供しております。中古車の販売をはじめ、あらゆるニーズにお応えできる体制を整えております。お客様一人ひとりのカーライフをより安心で快適なものにするために、質の高いサービスをご提供いたします。また、中古車輸出業務も展開しており、様々の国まで信頼できる中古車をお届けします。",
    image: "/images/original-site/auto-service.jpeg",
    alt: "自動車整備の作業風景",
    href: "/custom-plan",
    cta: "車両改装を申し込む",
  },
  {
    label: "プラスチックのリサイクル及び輸出",
    title: "環境保全と資源の有効活用を支えるリサイクル事業",
    body: "当社は、環境保全と資源の有効活用を目的とし、プラスチックのリサイクルおよび輸出事業を展開しております。国内外の企業や自治体と連携し、廃プラスチックの回収・選別・再生処理を行い、高品質なリサイクル原料として再利用できる形で供給しています。",
    image: "/images/original-site/recycle-service.jpg",
    alt: "プラスチックリサイクル事業のイメージ",
    href: "https://ryouritsu.mhlw.go.jp/hiroba/planfile2/2026/202602041111045261902_1.pdf",
    cta: "一般事業主行動計画",
    external: true,
  },
];

export function BusinessSummary() {
  return (
    <section className="section section--business" id="business">
      <div className="business-feature-wrap">
        <div className="container">
          <div className="section-title-center">
            <p>SERVICE</p>
            <h2>サービス</h2>
          </div>
          <div className="business-feature-list">
            {businesses.map((business, index) => (
              <article className="business-feature" key={business.label}>
                <div className="business-feature__copy">
                  <span className="business-feature__label">{business.label}</span>
                  <h3>{business.title}</h3>
                  <p>{business.body}</p>
                  {business.external ? (
                    <a className="business-feature__link" href={business.href}>
                      {business.cta}
                    </a>
                  ) : (
                    <Link className="business-feature__link" href={business.href}>
                      {business.cta}
                    </Link>
                  )}
                </div>
                <div className="business-feature__media">
                  <Image
                    src={business.image}
                    alt={business.alt}
                    fill
                    sizes="(max-width: 920px) 100vw, 44vw"
                    priority={index === 0}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

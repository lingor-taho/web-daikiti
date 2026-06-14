const businesses = [
  {
    title: "自動車トータルサービス事業",
    body: "中古車の販売をはじめ、自動車に関する幅広いサービスを提供します。中古車輸出業務も展開し、さまざまな国へ信頼できる中古車をお届けします。",
  },
  {
    title: "プラスチックのリサイクル及び輸出",
    body: "環境保全と資源の有効活用を目的に、プラスチックのリサイクルおよび輸出事業を展開しています。廃プラスチックを再利用できる原料として供給します。",
  },
];

export function BusinessSummary() {
  return (
    <section className="section section--business" id="business">
      <div className="container">
        <div className="section-heading">
          <p className="section-heading__label">Business</p>
          <h2>事業紹介</h2>
          <p>
            自動車業界におけるトータルカーサポートを軸に、資源循環に関わる事業も展開しています。
          </p>
        </div>
        <div className="business-grid">
          {businesses.map((business, index) => (
            <article className="business-card" key={business.title}>
              <span className="business-card__number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{business.title}</h3>
              <p>{business.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

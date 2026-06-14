const businesses = [
  {
    title: "自動車トータルサービス事業",
    body: "中古車販売、買取、輸出、整備相談、改装まで、車に関わる幅広いニーズに対応します。用途や状態を見極め、実用性と見た目の両面から提案します。",
  },
  {
    title: "プラスチックのリサイクル及び輸出",
    body: "既存事業としてリサイクル及び輸出にも取り組み、国内外のネットワークを活かして企業活動を支えます。",
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
            自動車に関わるサービスを軸に、既存事業も含めて信頼性のある事業展開を行っています。
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

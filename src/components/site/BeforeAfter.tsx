import Image from "next/image";

type BeforeAfterProps = {
  title: string;
  beforeImage?: string | null;
  afterImage?: string | null;
};

export function BeforeAfter({ title, beforeImage, afterImage }: BeforeAfterProps) {
  if (!beforeImage && !afterImage) {
    return null;
  }

  return (
    <section className="before-after" aria-labelledby="before-after-heading">
      <h2 id="before-after-heading">Before / After</h2>
      <div className="before-after__grid">
        {beforeImage ? (
          <figure className="before-after__item">
            <div className="before-after__image">
              <Image
                src={beforeImage}
                alt={`${title}の施工前`}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
            <figcaption>Before</figcaption>
          </figure>
        ) : null}
        {afterImage ? (
          <figure className="before-after__item">
            <div className="before-after__image">
              <Image src={afterImage} alt={`${title}の施工後`} fill sizes="(max-width: 760px) 100vw, 50vw" />
            </div>
            <figcaption>After</figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}

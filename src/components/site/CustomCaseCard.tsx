import Image from "next/image";
import Link from "next/link";
import type { CustomCaseListItem } from "@/lib/queries/customCases";

type CustomCaseCardProps = {
  customCase: CustomCaseListItem;
};

export function CustomCaseCard({ customCase }: CustomCaseCardProps) {
  return (
    <Link className="case-card" href={`/custom-works/${customCase.slug}`}>
      <div className="case-card__image">
        <Image
          src={customCase.coverImage}
          alt={`${customCase.title}の施工写真`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 920px) 50vw, 33vw"
        />
      </div>
      <div className="case-card__body">
        <div className="case-card__meta">
          <span>{customCase.brand.name}</span>
          {customCase.categories.slice(0, 2).map(({ category }) => (
            <span key={category.id}>{category.name}</span>
          ))}
        </div>
        <h3>{customCase.title}</h3>
        <p>{customCase.summary}</p>
        {customCase.tags.length > 0 ? (
          <div className="case-card__tags" aria-label="事例タグ">
            {customCase.tags.slice(0, 3).map((tag) => (
              <span key={tag.id}>#{tag.name}</span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

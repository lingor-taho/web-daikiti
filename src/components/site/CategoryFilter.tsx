import Link from "next/link";
import type { CustomCategory } from "@prisma/client";

type CategoryFilterProps = {
  categories: CustomCategory[];
  currentBrand?: string;
  currentCategory?: string;
};

function getCategoryHref(category?: string, brand?: string) {
  const params = new URLSearchParams();

  if (brand) {
    params.set("brand", brand);
  }

  if (category) {
    params.set("category", category);
  }

  const query = params.toString();
  return query ? `/custom-works?${query}` : "/custom-works";
}

export function CategoryFilter({ categories, currentBrand, currentCategory }: CategoryFilterProps) {
  return (
    <nav className="brand-filter" aria-label="施工内容で絞り込み">
      <Link
        aria-current={!currentCategory ? "page" : undefined}
        className={!currentCategory ? "brand-filter__item is-active" : "brand-filter__item"}
        href={getCategoryHref(undefined, currentBrand)}
      >
        すべて
      </Link>
      {categories.map((category) => (
        <Link
          aria-current={currentCategory === category.slug ? "page" : undefined}
          className={currentCategory === category.slug ? "brand-filter__item is-active" : "brand-filter__item"}
          href={getCategoryHref(category.slug, currentBrand)}
          key={category.id}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

import Link from "next/link";
import type { Brand } from "@prisma/client";

type BrandFilterProps = {
  brands: Brand[];
  currentBrand?: string;
  currentCategory?: string;
};

function getBrandHref(brand?: string, category?: string) {
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

export function BrandFilter({ brands, currentBrand, currentCategory }: BrandFilterProps) {
  return (
    <nav className="brand-filter" aria-label="Filter by brand">
      <Link
        aria-current={!currentBrand ? "page" : undefined}
        className={!currentBrand ? "brand-filter__item is-active" : "brand-filter__item"}
        href={getBrandHref(undefined, currentCategory)}
      >
        ALL
      </Link>
      {brands.map((brand) => (
        <Link
          aria-current={currentBrand === brand.slug ? "page" : undefined}
          className={currentBrand === brand.slug ? "brand-filter__item is-active" : "brand-filter__item"}
          href={getBrandHref(brand.slug, currentCategory)}
          key={brand.id}
        >
          {brand.name}
        </Link>
      ))}
    </nav>
  );
}

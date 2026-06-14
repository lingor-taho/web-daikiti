import Link from "next/link";
import type { Brand } from "@prisma/client";

type BrandFilterProps = {
  brands: Brand[];
  currentBrand?: string;
};

export function BrandFilter({ brands, currentBrand }: BrandFilterProps) {
  return (
    <nav className="brand-filter" aria-label="ブランドで絞り込む">
      <Link className={!currentBrand ? "brand-filter__item is-active" : "brand-filter__item"} href="/custom-works">
        ALL
      </Link>
      {brands.map((brand) => (
        <Link
          aria-current={currentBrand === brand.slug ? "page" : undefined}
          className={currentBrand === brand.slug ? "brand-filter__item is-active" : "brand-filter__item"}
          href={`/custom-works?brand=${encodeURIComponent(brand.slug)}`}
          key={brand.id}
        >
          {brand.name}
        </Link>
      ))}
    </nav>
  );
}

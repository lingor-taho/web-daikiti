import Link from "next/link";
import type { ReactNode } from "react";

type StaticPageHeroAction = {
  href: string;
  label: string;
  variant?: "accent" | "ghost";
};

type StaticPageHeroProps = {
  label: string;
  title: string;
  description: string;
  actions?: StaticPageHeroAction[];
};

export function StaticPageHero({ label, title, description, actions = [] }: StaticPageHeroProps) {
  return (
    <section className="static-hero">
      <div className="container static-hero__inner">
        <p className="static-hero__label">{label}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {actions.length > 0 ? (
          <div className="button-row">
            {actions.map((action) => (
              <Link
                className={`button ${action.variant === "ghost" ? "button--ghost" : "button--accent"}`}
                href={action.href}
                key={action.href}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

type InfoTableProps = {
  rows: Array<{
    label: string;
    value: ReactNode;
  }>;
};

export function InfoTable({ rows }: InfoTableProps) {
  return (
    <dl className="info-table">
      {rows.map((row) => (
        <div className="info-table__row" key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

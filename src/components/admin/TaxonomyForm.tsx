"use client";

import { useActionState } from "react";
import type { TaxonomyActionState } from "@/lib/actions/taxonomy";

type TaxonomyFormProps = {
  action: (previousState: TaxonomyActionState, formData: FormData) => Promise<TaxonomyActionState>;
  submitLabel: string;
};

export function TaxonomyForm({ action, submitLabel }: TaxonomyFormProps) {
  const [state, formAction, isPending] = useActionState(action, { ok: false, message: "" });

  return (
    <form action={formAction} className="admin-form">
      <section className="admin-form__section" aria-labelledby="taxonomy-basic-fields">
        <h2 id="taxonomy-basic-fields">Basic information</h2>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Name</span>
            <input className="admin-input" name="name" required type="text" />
          </label>

          <label className="admin-field">
            <span>Slug</span>
            <input
              className="admin-input"
              name="slug"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
              type="text"
            />
            <small>Lowercase letters, numbers, and hyphens only.</small>
          </label>

          <label className="admin-field">
            <span>Sort order</span>
            <input className="admin-input" defaultValue={0} name="sortOrder" step={1} type="number" />
          </label>
        </div>

        <label className="admin-checkbox">
          <input defaultChecked name="isActive" type="checkbox" />
          <span>Active</span>
        </label>

        {state.message ? (
          <p className={`admin-form__message ${state.ok ? "is-success" : "is-error"}`} role="status">
            {state.message}
          </p>
        ) : null}

        <div className="admin-form__actions">
          <button className="admin-button admin-button--primary" disabled={isPending} type="submit">
            {isPending ? "Saving..." : submitLabel}
          </button>
        </div>
      </section>
    </form>
  );
}

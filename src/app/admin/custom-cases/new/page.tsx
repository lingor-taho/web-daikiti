import { CustomCaseForm } from "@/components/admin/CustomCaseForm";
import { createCustomCaseAction } from "@/lib/actions/customCases";
import { getActiveBrands, getActiveCategories } from "@/lib/queries/customCases";

export const dynamic = "force-dynamic";

export default async function NewCustomCasePage() {
  const [brands, categories] = await Promise.all([getActiveBrands(), getActiveCategories()]);

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Custom Cases</p>
          <h1>New custom case</h1>
        </div>
      </header>

      <CustomCaseForm
        action={createCustomCaseAction}
        brands={brands}
        categories={categories}
        submitLabel="Create case"
      />
    </div>
  );
}

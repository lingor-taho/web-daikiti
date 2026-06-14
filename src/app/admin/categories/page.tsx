import { AdminTable } from "@/components/admin/AdminTable";
import { TaxonomyForm } from "@/components/admin/TaxonomyForm";
import { createCategory, setCategoryActive } from "@/lib/actions/taxonomy";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getCategories() {
  return db.customCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Categories</p>
          <h1>Category maintenance</h1>
        </div>
      </header>

      <TaxonomyForm action={createCategory} submitLabel="Add category" />

      {categories.length > 0 ? (
        <AdminTable columns={["Name", "Slug", "Sort", "Status", "Action"]}>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <span className="admin-table__title">{category.name}</span>
              </td>
              <td>{category.slug}</td>
              <td>{category.sortOrder}</td>
              <td>
                <span
                  className={`admin-status ${category.isActive ? "admin-status--active" : "admin-status--inactive"}`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <form action={setCategoryActive.bind(null, category.id, !category.isActive)}>
                  <button className="admin-button admin-button--secondary admin-button--compact" type="submit">
                    {category.isActive ? "Disable" : "Enable"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </AdminTable>
      ) : (
        <div className="admin-empty">
          <h2>No categories yet</h2>
          <p>Add the first category for custom works filtering.</p>
        </div>
      )}
    </div>
  );
}

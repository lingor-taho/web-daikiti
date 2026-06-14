import { AdminTable } from "@/components/admin/AdminTable";
import { TaxonomyForm } from "@/components/admin/TaxonomyForm";
import { createBrand, setBrandActive } from "@/lib/actions/taxonomy";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getBrands() {
  return db.brand.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Brands</p>
          <h1>Brand maintenance</h1>
        </div>
      </header>

      <TaxonomyForm action={createBrand} submitLabel="Add brand" />

      {brands.length > 0 ? (
        <AdminTable columns={["Name", "Slug", "Sort", "Status", "Action"]}>
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td>
                <span className="admin-table__title">{brand.name}</span>
              </td>
              <td>{brand.slug}</td>
              <td>{brand.sortOrder}</td>
              <td>
                <span className={`admin-status ${brand.isActive ? "admin-status--active" : "admin-status--inactive"}`}>
                  {brand.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <form action={setBrandActive.bind(null, brand.id, !brand.isActive)}>
                  <button className="admin-button admin-button--secondary admin-button--compact" type="submit">
                    {brand.isActive ? "Disable" : "Enable"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </AdminTable>
      ) : (
        <div className="admin-empty">
          <h2>No brands yet</h2>
          <p>Add the first brand for custom works filtering.</p>
        </div>
      )}
    </div>
  );
}

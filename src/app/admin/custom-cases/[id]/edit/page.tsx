import { notFound } from "next/navigation";
import { CustomCaseForm } from "@/components/admin/CustomCaseForm";
import { updateCustomCaseAction } from "@/lib/actions/customCases";
import { db } from "@/lib/db";
import { getActiveBrands, getActiveCategories } from "@/lib/queries/customCases";

export const dynamic = "force-dynamic";

type EditCustomCasePageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getEditableCustomCase(id: number) {
  return db.customCase.findUnique({
    where: { id },
    include: {
      categories: true,
      tags: true,
    },
  });
}

export default async function EditCustomCasePage({ params }: EditCustomCasePageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const [customCase, brands, categories] = await Promise.all([
    getEditableCustomCase(id),
    getActiveBrands(),
    getActiveCategories(),
  ]);

  if (!customCase) {
    notFound();
  }

  const updateAction = updateCustomCaseAction.bind(null, customCase.id);

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Custom Cases</p>
          <h1>Edit custom case</h1>
        </div>
      </header>

      <CustomCaseForm
        action={updateAction}
        brands={brands}
        categories={categories}
        initialValues={{
          afterImage: customCase.afterImage,
          beforeImage: customCase.beforeImage,
          brandId: customCase.brandId,
          categoryIds: customCase.categories.map((category) => category.categoryId),
          content: customCase.content,
          coverImage: customCase.coverImage,
          galleryJson: customCase.galleryJson,
          isFeatured: customCase.isFeatured,
          modelName: customCase.modelName,
          slug: customCase.slug,
          sortOrder: customCase.sortOrder,
          status: customCase.status,
          summary: customCase.summary,
          tags: customCase.tags.map((tag) => tag.name),
          title: customCase.title,
        }}
        submitLabel="Update case"
      />
    </div>
  );
}

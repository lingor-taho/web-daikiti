import { PublishStatus, type Brand, type CustomCategory } from "@prisma/client";
import Link from "next/link";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export type CustomCaseFormValues = {
  afterImage?: string | null;
  beforeImage?: string | null;
  brandId?: number;
  categoryIds: number[];
  content?: string;
  coverImage?: string | null;
  galleryJson?: string;
  isFeatured?: boolean;
  modelName?: string | null;
  slug?: string;
  sortOrder?: number;
  status?: PublishStatus;
  summary?: string;
  tags: string[];
  title?: string;
};

type CustomCaseFormProps = {
  action: (formData: FormData) => Promise<void>;
  brands: Pick<Brand, "id" | "name">[];
  categories: Pick<CustomCategory, "id" | "name">[];
  initialValues?: CustomCaseFormValues;
  submitLabel: string;
};

const emptyValues: CustomCaseFormValues = {
  categoryIds: [],
  galleryJson: "[]",
  status: PublishStatus.DRAFT,
  tags: [],
};

export function CustomCaseForm({
  action,
  brands,
  categories,
  initialValues,
  submitLabel,
}: CustomCaseFormProps) {
  const values = {
    ...emptyValues,
    ...initialValues,
    categoryIds: initialValues?.categoryIds ?? emptyValues.categoryIds,
    tags: initialValues?.tags ?? emptyValues.tags,
  };

  return (
    <form action={action} className="admin-form">
      <section className="admin-form__section" aria-labelledby="case-basic-fields">
        <h2 id="case-basic-fields">Basic information</h2>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Title</span>
            <input className="admin-input" defaultValue={values.title ?? ""} name="title" required type="text" />
          </label>

          <label className="admin-field">
            <span>Slug</span>
            <input
              className="admin-input"
              defaultValue={values.slug ?? ""}
              name="slug"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
              type="text"
            />
            <small>Lowercase letters, numbers, and hyphens only.</small>
          </label>

          <label className="admin-field">
            <span>Brand</span>
            <select className="admin-input" defaultValue={values.brandId ?? ""} name="brandId" required>
              <option value="" disabled>
                Select brand
              </option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Model name</span>
            <input className="admin-input" defaultValue={values.modelName ?? ""} name="modelName" type="text" />
          </label>
        </div>

        <label className="admin-field">
          <span>Summary</span>
          <textarea className="admin-textarea" defaultValue={values.summary ?? ""} name="summary" required rows={4} />
        </label>
      </section>

      <section className="admin-form__section" aria-labelledby="case-media-fields">
        <h2 id="case-media-fields">Images</h2>
        <div className="admin-form__grid">
          <ImageUploadField
            defaultValue={values.coverImage}
            helpText="Upload support comes later; use an image URL or public path for now."
            label="Cover image URL"
            name="coverImage"
            required
          />
          <ImageUploadField defaultValue={values.beforeImage} label="Before image URL" name="beforeImage" />
          <ImageUploadField defaultValue={values.afterImage} label="After image URL" name="afterImage" />
        </div>
      </section>

      <section className="admin-form__section" aria-labelledby="case-content-fields">
        <h2 id="case-content-fields">Content</h2>
        <div className="admin-field">
          <span id="case-content-body-label">Body</span>
          <RichTextEditor initialValue={values.content ?? ""} labelledBy="case-content-body-label" name="content" />
        </div>

        <label className="admin-field">
          <span>Gallery JSON</span>
          <textarea
            className="admin-textarea admin-textarea--code"
            defaultValue={values.galleryJson ?? "[]"}
            name="galleryJson"
            rows={5}
          />
          <small>Use a JSON array of image URLs. Example: [&quot;/images/example.jpg&quot;]</small>
        </label>
      </section>

      <section className="admin-form__section" aria-labelledby="case-publishing-fields">
        <h2 id="case-publishing-fields">Publishing</h2>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Status</span>
            <select className="admin-input" defaultValue={values.status ?? PublishStatus.DRAFT} name="status">
              <option value={PublishStatus.DRAFT}>Draft</option>
              <option value={PublishStatus.PUBLISHED}>Published</option>
            </select>
          </label>

          <label className="admin-field">
            <span>Sort order</span>
            <input
              className="admin-input"
              defaultValue={values.sortOrder ?? 0}
              name="sortOrder"
              type="number"
            />
          </label>
        </div>

        <label className="admin-checkbox">
          <input defaultChecked={values.isFeatured ?? false} name="isFeatured" type="checkbox" />
          <span>Featured on the home page</span>
        </label>
      </section>

      <section className="admin-form__section" aria-labelledby="case-relation-fields">
        <h2 id="case-relation-fields">Categories and tags</h2>
        <fieldset className="admin-fieldset">
          <legend>Categories</legend>
          <div className="admin-checkbox-list">
            {categories.map((category) => (
              <label className="admin-checkbox" key={category.id}>
                <input
                  defaultChecked={values.categoryIds.includes(category.id)}
                  name="categoryIds"
                  type="checkbox"
                  value={category.id}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="admin-field">
          <span>Tags</span>
          <input className="admin-input" defaultValue={values.tags.join(", ")} name="tags" type="text" />
          <small>Separate tags with commas.</small>
        </label>
      </section>

      <div className="admin-form__actions">
        <Link className="admin-button admin-button--secondary" href="/admin/custom-cases">
          Cancel
        </Link>
        <button className="admin-button admin-button--primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

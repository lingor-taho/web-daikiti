# DKT Motors Redesign Handoff Checklist

## Required Configuration

- Set `DATABASE_URL` for the target database.
- Set `ADMIN_USER` and `ADMIN_PASSWORD` before enabling `/admin`.
- Run Prisma migration/generation for the target environment.
- Run the seed script only when starter brands, categories, and demo cases are needed.

## Content To Replace Before Public Launch

- Review company profile values on `/company` against the latest official registration before public launch.
- Review address, hours, and access notes on `/access`; replace the map placeholder with a live map embed if needed.
- Replace placeholder vehicle images with approved case photos.
- Review privacy policy text against the final operating company and legal requirements.

## Uploads

- Admin image uploads are stored under `public/uploads/custom-cases/`.
- Production must provide a persistent writable filesystem and backups for that directory.
- For serverless, multi-instance, or immutable deployments, move uploads to object storage before launch.
- SVG uploads are intentionally blocked; accepted formats are JPEG, PNG, WebP, and GIF.

## Verification Commands

- `npm run lint`
- `node --import tsx --test tests\*.test.ts`
- `npm run build`

## Browser QA Completed

- Desktop width: home, business, custom works list/detail, company, access, contact, privacy.
- Mobile width: home, business, custom works list/detail, company, access, contact, privacy.
- Admin: custom case list/edit pages and upload controls.
- Upload endpoint: authenticated upload succeeds, unauthenticated upload returns `401`.

# Deployment Notes

Admin custom case image uploads are stored on the local filesystem under `public/uploads/custom-cases/`.

This requires a persistent writable filesystem in production and a backup plan for uploaded files. For serverless, multi-instance, or immutable deployments, use object storage such as S3/R2/GCS instead of local disk before enabling admin uploads in production.

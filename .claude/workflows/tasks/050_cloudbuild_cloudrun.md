Agent: gcp
Steps:
- Create `infra/cloudbuild.yaml` to: build Docker images (api + web), run unit tests, and deploy to Cloud Run.
- Configure least-privileged SA for Cloud Build; use WIF to impersonate deploy SA.
- Wire build artifacts to Artifact Registry.

Acceptance:
- `gcloud builds submit` triggers build → Cloud Run deploy pipeline.

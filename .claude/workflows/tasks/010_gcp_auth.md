Agent: gcp
Steps:
1) Create Firebase project + Firestore native mode.
2) Enable Cloud Run, Cloud Build, Secret Manager, Artifact Registry.
3) Configure Workload Identity Federation (no raw keys). Output commands & doc links.
4) Create service accounts with least privilege; bind roles; enable OIDC for GitHub or CI.
5) Store non-secret config in runtime env; secret values in Secret Manager.

Acceptance:
- Documented `gcloud` commands, `firebase init` artifacts, and WIF notes.

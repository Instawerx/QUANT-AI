Secrets migration helper scripts
===============================

This document describes two helper scripts included in the repository to assist
with migrating local secrets into GCP Secret Manager and GitHub repository
secrets. These scripts are intended for interactive use on a developer machine
and assume you have the necessary CLIs and permissions configured.

Prerequisites
-------------
- `gcloud` CLI authenticated and configured for your target project
- `gh` (GitHub CLI) authenticated (`gh auth login`)
- `jq` (optional for JSON handling)
- Local `secrets/firebase-service-account.json` present (for upload)

Scripts
-------

1. `scripts/upload-firebase-secret-to-gcp.sh`

- Purpose: Uploads the local `secrets/firebase-service-account.json` to GCP
  Secret Manager as a secret and creates a new version if the secret exists.
- Usage:

```bash
chmod +x scripts/upload-firebase-secret-to-gcp.sh
./scripts/upload-firebase-secret-to-gcp.sh quantai-firebase-sa your-gcp-project-id
```

2. `scripts/set-github-secrets.ps1`

- Purpose: Use the GitHub CLI to set repository secrets in bulk. Prompts for
  values for non-file secrets securely. If `secrets/firebase-service-account.json`
  exists locally the script will add it as `FIREBASE_SERVICE_ACCOUNT_STAGING` and
  `FIREBASE_SERVICE_ACCOUNT_PRODUCTION` (adjust as needed).
- Usage (PowerShell):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\set-github-secrets.ps1 -Repo 'Instawerx/QUANT-AI'
```

Security reminder
-----------------
- These scripts will upload secrets to cloud services — ensure you use the
  correct project and repository.
- Rotate keys immediately if they were ever exposed in public channels.

If you want, I can run these scripts here (uploading to your GCP / GitHub) if you
explicitly authorize and provide any missing credentials; otherwise run them
locally per the instructions above.

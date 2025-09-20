#!/usr/bin/env bash
# Uploads the local secrets/firebase-service-account.json to GCP Secret Manager
# Usage: ./scripts/upload-firebase-secret-to-gcp.sh <secret-name> <project-id>
# Requires: gcloud CLI authenticated and configured, and the current user has
# permission to create secrets in the target project.

set -euo pipefail

SECRET_NAME=${1:-quantai-firebase-sa}
PROJECT_ID=${2:-$GOOGLE_CLOUD_PROJECT_ID}
FILE=secrets/firebase-service-account.json

if [ ! -f "$FILE" ]; then
  echo "Error: $FILE not found. Place your service account JSON at $FILE before running."
  exit 2
fi

if [ -z "$PROJECT_ID" ]; then
  echo "Error: project id not provided and GOOGLE_CLOUD_PROJECT_ID not set."
  exit 2
fi

echo "Creating secret $SECRET_NAME in project $PROJECT_ID (or updating if exists)..."
# Check if secret exists
if gcloud secrets describe "$SECRET_NAME" --project="$PROJECT_ID" >/dev/null 2>&1; then
  echo "Secret exists, creating new secret version..."
  gcloud secrets versions add "$SECRET_NAME" --data-file="$FILE" --project="$PROJECT_ID"
else
  echo "Secret does not exist, creating secret and adding version..."
  gcloud secrets create "$SECRET_NAME" --replication-policy="automatic" --project="$PROJECT_ID"
  gcloud secrets versions add "$SECRET_NAME" --data-file="$FILE" --project="$PROJECT_ID"
fi

echo "Secret uploaded to GCP Secret Manager: projects/$PROJECT_ID/secrets/$SECRET_NAME"

echo "Granting Secret Accessor permission to current project service accounts (optional step)."
# Example: grant access to a runtime service account (adjust as needed)
# gcloud secrets add-iam-policy-binding "$SECRET_NAME" --project="$PROJECT_ID" \
#   --member="serviceAccount:my-runtime-sa@$PROJECT_ID.iam.gserviceaccount.com" \
#   --role="roles/secretmanager.secretAccessor"

echo "Done."

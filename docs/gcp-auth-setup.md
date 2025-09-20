# GCP Authentication Setup for QUANT-AI

This document provides step-by-step instructions for setting up Google Cloud Platform authentication using Workload Identity Federation.

## Prerequisites

- Google Cloud CLI installed and configured
- Firebase CLI installed
- Access to the `studio-5150539807-1dba3` project

## Setup Steps

### 1. Run Authentication Setup Script

```bash
chmod +x scripts/gcp/setup-auth.sh
./scripts/gcp/setup-auth.sh
```

This script will:
- Enable required GCP APIs
- Create Artifact Registry repository
- Set up service accounts with least privilege
- Configure Workload Identity Federation
- Create OIDC provider for GitHub Actions

### 2. Create Secret Manager Secrets

```bash
chmod +x scripts/gcp/create-secrets.sh
./scripts/gcp/create-secrets.sh
```

### 3. Add Secret Values

Add your actual secret values to Secret Manager:

```bash
# Google AI API Key
echo "your-google-ai-api-key" | gcloud secrets versions add google-ai-api-key --data-file=-

# Firebase Admin Config
gcloud secrets versions add firebase-admin-config --data-file=path/to/service-account.json

# Ethereum RPC URL
echo "https://your-ethereum-rpc-url" | gcloud secrets versions add ethereum-rpc-url --data-file=-

# Contract deployment private key (for testnet only)
echo "your-private-key" | gcloud secrets versions add contract-private-key --data-file=-
```

### 4. Configure GitHub Repository

Add these secrets to your GitHub repository settings:

- `WIF_PROVIDER`: The Workload Identity Provider ID
- `WIF_SERVICE_ACCOUNT`: The service account email

### 5. Initialize Firebase

```bash
firebase init firestore
```

## Security Features

✅ **No JSON service account keys** - Uses Workload Identity Federation
✅ **Least privilege access** - Service accounts have minimal required permissions
✅ **Secret Manager integration** - All sensitive data stored securely
✅ **Default-deny Firestore rules** - Database access requires authentication

## Services Enabled

- Cloud Build (CI/CD)
- Cloud Run (Container hosting)
- Secret Manager (Secure storage)
- Artifact Registry (Docker images)
- Firestore (Database)
- Firebase (Authentication & hosting)

## Continuous Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` provides:

1. **Automated testing** on every PR
2. **Secure authentication** via Workload Identity Federation
3. **Docker image building** and pushing to Artifact Registry
4. **Cloud Run deployment** with environment variables from Secret Manager
5. **Firestore rules deployment**

## Troubleshooting

### Permission Denied Errors
Ensure the service account has the correct IAM roles:
- `roles/run.admin`
- `roles/cloudbuild.builds.builder`
- `roles/artifactregistry.writer`
- `roles/secretmanager.secretAccessor`
- `roles/datastore.user`

### Workload Identity Issues
Verify the repository name matches exactly in the workload identity binding.

## Documentation Links

- [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [GitHub Actions with GCP](https://github.com/google-github-actions/auth)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Secret Manager](https://cloud.google.com/secret-manager/docs)
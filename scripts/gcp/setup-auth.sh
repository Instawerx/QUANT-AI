#!/bin/bash
# GCP Authentication Setup for QUANT-AI
# This script sets up Workload Identity Federation and required services

set -e

PROJECT_ID="studio-5150539807-1dba3"
LOCATION="us-central1"
WIF_POOL_NAME="quant-ai-github-pool"
WIF_PROVIDER_NAME="quant-ai-github-provider"
SERVICE_ACCOUNT_NAME="quant-ai-deployer"

echo "🚀 Setting up GCP Authentication for QUANT-AI..."

# 1. Set the active project
echo "Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# 2. Enable required APIs
echo "Enabling required GCP APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    secretmanager.googleapis.com \
    artifactregistry.googleapis.com \
    firestore.googleapis.com \
    firebase.googleapis.com \
    iam.googleapis.com \
    iamcredentials.googleapis.com \
    sts.googleapis.com

# 3. Create Artifact Registry for Docker images
echo "Creating Artifact Registry..."
gcloud artifacts repositories create quant-ai \
    --repository-format=docker \
    --location=$LOCATION \
    --description="Docker repository for QUANT-AI" || echo "Repository may already exist"

# 4. Create service account for deployment
echo "Creating service account..."
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name="QUANT-AI Deployer" \
    --description="Service account for QUANT-AI deployments" || echo "Service account may already exist"

# 5. Grant necessary roles to service account
echo "Granting IAM roles..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/datastore.user"

# 6. Create Workload Identity Pool
echo "Creating Workload Identity Pool..."
gcloud iam workload-identity-pools create $WIF_POOL_NAME \
    --location="global" \
    --display-name="GitHub Actions Pool for QUANT-AI" \
    --description="Workload Identity Pool for GitHub Actions" || echo "Pool may already exist"

# 7. Create Workload Identity Provider for GitHub
echo "Creating Workload Identity Provider..."
gcloud iam workload-identity-pools providers create-oidc $WIF_PROVIDER_NAME \
    --location="global" \
    --workload-identity-pool=$WIF_POOL_NAME \
    --display-name="GitHub Actions Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor" \
    --issuer-uri="https://token.actions.githubusercontent.com" || echo "Provider may already exist"

# 8. Allow GitHub Actions to impersonate service account
echo "Configuring impersonation..."
gcloud iam service-accounts add-iam-policy-binding \
    "${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')/locations/global/workloadIdentityPools/$WIF_POOL_NAME/attribute.repository/YOUR_GITHUB_USERNAME/quant-ai"

echo "✅ GCP Authentication setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Replace 'YOUR_GITHUB_USERNAME' in the script with your actual GitHub username"
echo "2. Add these secrets to your GitHub repository:"
echo "   WIF_PROVIDER: projects/$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')/locations/global/workloadIdentityPools/$WIF_POOL_NAME/providers/$WIF_PROVIDER_NAME"
echo "   WIF_SERVICE_ACCOUNT: ${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
echo "3. Run 'firebase init' to configure Firestore"
echo ""
echo "🔗 Documentation links:"
echo "- Workload Identity Federation: https://cloud.google.com/iam/docs/workload-identity-federation"
echo "- GitHub Actions with GCP: https://github.com/google-github-actions/auth"
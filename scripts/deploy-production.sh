#!/bin/bash
# Production deployment script for QuantAI

set -e

PROJECT_ID="studio-5150539807-1dba3"
REGION="us-central1"
SERVICE_NAME="quant-ai"

echo "🚀 Deploying QuantAI to production..."

# Ensure we're authenticated
echo "🔐 Checking GCP authentication..."
gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -1

# Set the project
gcloud config set project $PROJECT_ID

# Submit build to Cloud Build
echo "🏗️ Triggering Cloud Build..."
BUILD_ID=$(gcloud builds submit --config=infra/cloudbuild.yaml --format="value(id)")
echo "Build ID: $BUILD_ID"

# Monitor build status
echo "📊 Monitoring build progress..."
gcloud builds log --stream $BUILD_ID

# Get build status
BUILD_STATUS=$(gcloud builds describe $BUILD_ID --format="value(status)")

if [ "$BUILD_STATUS" = "SUCCESS" ]; then
    echo "✅ Build successful!"

    # Get Cloud Run service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

    echo "🌐 Service deployed at: $SERVICE_URL"
    echo "📋 Health check: $SERVICE_URL/api/health"

    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    curl -f $SERVICE_URL/api/health && echo "✅ Health check passed!" || echo "❌ Health check failed!"

else
    echo "❌ Build failed with status: $BUILD_STATUS"
    exit 1
fi

echo "🎉 Deployment complete!"
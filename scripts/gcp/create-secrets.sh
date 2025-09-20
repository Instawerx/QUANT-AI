#!/bin/bash
# Create Secret Manager secrets for QUANT-AI
# Run this script after setup-auth.sh

set -e

PROJECT_ID="studio-5150539807-1dba3"

echo "🔐 Creating Secret Manager secrets for QUANT-AI..."

# Create secrets for various services
echo "Creating API key secrets..."

# Google AI API Key for Genkit
gcloud secrets create google-ai-api-key \
    --replication-policy="automatic" \
    --project=$PROJECT_ID || echo "Secret may already exist"

# Firebase Admin SDK (for server-side operations)
gcloud secrets create firebase-admin-config \
    --replication-policy="automatic" \
    --project=$PROJECT_ID || echo "Secret may already exist"

# Ethereum/Web3 secrets
gcloud secrets create ethereum-rpc-url \
    --replication-policy="automatic" \
    --project=$PROJECT_ID || echo "Secret may already exist"

gcloud secrets create contract-private-key \
    --replication-policy="automatic" \
    --project=$PROJECT_ID || echo "Secret may already exist"

# Database connection strings
gcloud secrets create database-url \
    --replication-policy="automatic" \
    --project=$PROJECT_ID || echo "Secret may already exist"

echo "✅ Secret Manager secrets created!"
echo ""
echo "📋 To add secret values, use:"
echo "gcloud secrets versions add google-ai-api-key --data-file=-"
echo "gcloud secrets versions add firebase-admin-config --data-file=path/to/service-account.json"
echo "gcloud secrets versions add ethereum-rpc-url --data-file=-"
echo "gcloud secrets versions add contract-private-key --data-file=-"
echo "gcloud secrets versions add database-url --data-file=-"
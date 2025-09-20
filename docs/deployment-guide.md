# Cloud Deployment Guide for QuantAI

This guide covers the complete deployment pipeline for QuantAI using Google Cloud Platform.

## Architecture Overview

- **Cloud Build**: Automated CI/CD pipeline with testing and security validation
- **Artifact Registry**: Secure Docker image storage
- **Cloud Run**: Scalable container hosting with auto-scaling
- **Secret Manager**: Secure credential and configuration management
- **Firestore**: Managed NoSQL database with security rules

## Deployment Pipeline

### 1. Automated Cloud Build

The deployment pipeline is triggered via:

```bash
# Manual deployment
gcloud builds submit --config=infra/cloudbuild.yaml

# Or use the deployment script
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

### 2. Build Steps

The Cloud Build pipeline includes:

1. **Dependency Installation** - `npm ci` with production optimizations
2. **Quality Gates**:
   - TypeScript compilation (`npm run typecheck`)
   - Code linting (`npm run lint:ts`)
   - Smart contract compilation (`npm run contracts:compile`)
   - Comprehensive testing (`npm run test`)
   - 95% coverage validation (`npm run test:coverage`)
3. **Application Build** - Next.js production build
4. **Docker Image Creation** - Multi-stage optimized container
5. **Registry Push** - Secure upload to Artifact Registry
6. **Cloud Run Deployment** - Automated service deployment
7. **Firestore Rules** - Database security rule deployment

### 3. Production Configuration

**Cloud Run Service Specs:**
- **CPU**: 2 vCPU
- **Memory**: 1 GiB
- **Concurrency**: 80 requests per instance
- **Scaling**: 1-100 instances
- **Timeout**: 5 minutes
- **Health Check**: `/api/health` endpoint

**Security Features:**
- Non-root container execution
- Secret Manager integration
- Workload Identity Federation
- Least-privilege service accounts

## Environment Configuration

### Required Secrets

Set up these secrets in Secret Manager:

```bash
# Google AI API Key
echo "your-api-key" | gcloud secrets create google-ai-api-key --data-file=-

# Ethereum RPC URL
echo "https://your-rpc-url" | gcloud secrets create ethereum-rpc-url --data-file=-

# Firebase Token (for rule deployment)
firebase login:ci | gcloud secrets create firebase-token --data-file=-
```

### Environment Variables

- `NODE_ENV=production`
- `PROJECT_ID`: Google Cloud Project ID
- `NEXT_TELEMETRY_DISABLED=1`

## Deployment Validation

### Health Checks

The application includes comprehensive health monitoring:

```bash
# Health endpoint
curl https://your-service-url/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600
}
```

### Performance Metrics

- **Cold Start**: < 2 seconds
- **Response Time**: < 500ms
- **Availability**: 99.9%
- **Auto-scaling**: 0-100 instances

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check test coverage >= 95%
   - Verify all linting passes
   - Ensure environment variables are set

2. **Deployment Errors**
   - Verify service account permissions
   - Check Secret Manager access
   - Validate Artifact Registry permissions

3. **Runtime Issues**
   - Monitor Cloud Run logs
   - Check health endpoint
   - Verify secret access

### Monitoring Commands

```bash
# View Cloud Run logs
gcloud run services logs read quant-ai --region=us-central1

# Check service status
gcloud run services describe quant-ai --region=us-central1

# Monitor build status
gcloud builds list --limit=10
```

## Rollback Procedure

In case of deployment issues:

```bash
# List previous revisions
gcloud run revisions list --service=quant-ai --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic quant-ai \
  --to-revisions=REVISION_NAME=100 \
  --region=us-central1
```

## Security Considerations

- All secrets stored in Secret Manager
- Container runs as non-root user
- Firestore rules enforce data isolation
- HTTPS-only traffic
- Regular security updates via automated builds

This deployment architecture ensures high availability, security, and scalability for the QuantAI platform.
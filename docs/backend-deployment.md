# QuantAI Backend Deployment Guide

This guide covers the deployment of the QuantAI Backend API to Google Cloud Run.

## Prerequisites

1. **Google Cloud Project**: Set up with billing enabled
2. **Firebase Project**: Configured with Firestore
3. **Smart Contracts**: Deployed MetaMaskPortfolioManager contract
4. **Secrets**: Contract addresses and private keys ready
5. **Network Access**: RPC endpoint (Infura, Alchemy, etc.)

## Environment Variables and Secrets

### Required Secrets in Google Secret Manager

Before deployment, create these secrets in Google Secret Manager:

```bash
# Navigate to Google Cloud Console > Security > Secret Manager

# 1. Admin wallet private key (without 0x prefix)
gcloud secrets create quantai-private-key --data-file=- <<< "your_private_key_here"

# 2. RPC endpoint URL
gcloud secrets create quantai-rpc-url --data-file=- <<< "https://sepolia.infura.io/v3/YOUR_API_KEY"

# 3. Contract addresses (REPLACE WITH ACTUAL ADDRESSES)
gcloud secrets create quantai-portfolio-manager-address --data-file=- <<< "0xYourPortfolioManagerAddress"
gcloud secrets create quantai-token-address --data-file=- <<< "0xYourQuantTokenAddress"
gcloud secrets create quantai-access-registry-address --data-file=- <<< "0xYourAccessRegistryAddress"

# 4. Supported tokens (comma-separated)
gcloud secrets create quantai-supported-tokens --data-file=- <<< "0xToken1,0xToken2,0xToken3"

# 5. Security secrets
gcloud secrets create quantai-jwt-secret --data-file=- <<< "$(openssl rand -base64 32)"
gcloud secrets create quantai-session-secret --data-file=- <<< "$(openssl rand -base64 32)"
```

### Environment Variables Configuration

The following environment variables are configured in Cloud Run:

- `NODE_ENV=production`
- `PORT=3001`
- `FIREBASE_PROJECT_ID=${PROJECT_ID}`
- `CHAIN_ID=11155111` (Sepolia testnet)

## Service Account Setup

Create a service account for the backend:

```bash
# Create service account
gcloud iam service-accounts create quantai-backend \
  --display-name="QuantAI Backend Service Account" \
  --description="Service account for QuantAI backend API"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:quantai-backend@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:quantai-backend@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:quantai-backend@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/logging.logWriter"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:quantai-backend@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/monitoring.metricWriter"
```

## Cloud Build Configuration

### Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable firestore.googleapis.com
```

### Grant Cloud Build Permissions

```bash
# Get Cloud Build service account
CLOUD_BUILD_SA=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")@cloudbuild.gserviceaccount.com

# Grant Cloud Run deployment permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CLOUD_BUILD_SA" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CLOUD_BUILD_SA" \
  --role="roles/iam.serviceAccountUser"
```

## Deployment Methods

### Method 1: Cloud Build (Recommended)

Deploy using Cloud Build from the repository root:

```bash
# Submit build to Cloud Build
gcloud builds submit --config=backend/cloudbuild.yaml

# Monitor deployment
gcloud run services list --region=us-central1

# Get service URL
gcloud run services describe quantai-backend --region=us-central1 --format="value(status.url)"
```

### Method 2: Local Docker Build

Build and deploy locally:

```bash
# Navigate to backend directory
cd backend

# Build Docker image
docker build -t gcr.io/$PROJECT_ID/quantai-backend:latest .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/quantai-backend:latest

# Deploy to Cloud Run
gcloud run deploy quantai-backend \
  --image gcr.io/$PROJECT_ID/quantai-backend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --max-instances 10 \
  --min-instances 0 \
  --port 3001 \
  --set-env-vars NODE_ENV=production \
  --set-env-vars PORT=3001 \
  --set-env-vars FIREBASE_PROJECT_ID=$PROJECT_ID \
  --set-env-vars CHAIN_ID=11155111 \
  --set-secrets PRIVATE_KEY=quantai-private-key:latest \
  --set-secrets NETWORK_RPC_URL=quantai-rpc-url:latest \
  --set-secrets METAMASK_PORTFOLIO_MANAGER_ADDRESS=quantai-portfolio-manager-address:latest \
  --set-secrets QUANT_TOKEN_ADDRESS=quantai-token-address:latest \
  --set-secrets ACCESS_REGISTRY_ADDRESS=quantai-access-registry-address:latest \
  --set-secrets SUPPORTED_TOKENS=quantai-supported-tokens:latest \
  --set-secrets JWT_SECRET=quantai-jwt-secret:latest \
  --set-secrets SESSION_SECRET=quantai-session-secret:latest \
  --service-account quantai-backend@$PROJECT_ID.iam.gserviceaccount.com
```

## Post-Deployment Configuration

### 1. Update Frontend Configuration

Update your frontend to use the deployed backend URL:

```typescript
// In your frontend configuration
const API_BASE_URL = 'https://quantai-backend-HASH-uc.a.run.app';
```

### 2. Configure CORS

Update CORS settings if needed:

```bash
gcloud run services update quantai-backend \
  --region us-central1 \
  --set-env-vars CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. Set Up Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service quantai-backend \
  --domain api.yourdomain.com \
  --region us-central1
```

## Monitoring and Logging

### Cloud Logging

View logs:
```bash
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=quantai-backend" --limit=50
```

### Cloud Monitoring

Set up alerts for:
- High error rates
- High latency
- Memory usage
- CPU usage

### Health Checks

The service includes a health check endpoint at `/health`:

```bash
# Test health endpoint
curl https://your-service-url/health
```

## Security Considerations

### 1. Secret Management

- All sensitive data stored in Secret Manager
- No secrets in code or environment variables
- Regular secret rotation

### 2. Network Security

- Cloud Run service allows unauthenticated requests (API handles auth)
- Consider VPC connector for enhanced security
- Use HTTPS only

### 3. Authentication

- MetaMask signature-based authentication
- Session-based access control
- Admin privilege verification

### 4. Rate Limiting

- Built-in rate limiting per user
- Configure Cloud Armor for additional protection

## Scaling Configuration

### Auto-scaling Settings

- **Min instances**: 0 (cost-effective)
- **Max instances**: 10 (adjust based on load)
- **Concurrency**: 80 requests per instance
- **CPU**: 1 vCPU
- **Memory**: 512Mi

### Performance Tuning

Monitor and adjust:
- Instance limits based on traffic patterns
- Memory allocation based on usage
- CPU allocation for contract operations

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Check build logs
   gcloud builds log [BUILD_ID]
   ```

2. **Service Start Failures**
   ```bash
   # Check service logs
   gcloud logs read "resource.type=cloud_run_revision" --limit=10
   ```

3. **Secret Access Issues**
   ```bash
   # Verify secret access
   gcloud secrets versions access latest --secret=quantai-private-key
   ```

4. **Firebase Connection Issues**
   ```bash
   # Check service account permissions
   gcloud projects get-iam-policy $PROJECT_ID
   ```

### Debug Mode

Enable debug logging in production:

```bash
gcloud run services update quantai-backend \
  --region us-central1 \
  --set-env-vars LOG_LEVEL=debug
```

## Maintenance

### Updating Secrets

```bash
# Update a secret
echo "new_secret_value" | gcloud secrets versions add quantai-private-key --data-file=-

# Restart service to pick up new secrets
gcloud run services update quantai-backend --region us-central1
```

### Updating the Service

```bash
# Deploy new version
gcloud builds submit --config=backend/cloudbuild.yaml

# Rollback if needed
gcloud run services update quantai-backend \
  --region us-central1 \
  --image gcr.io/$PROJECT_ID/quantai-backend:previous-build-id
```

### Backup and Recovery

- Firebase data is automatically backed up
- Container images are stored in Container Registry
- Configuration is defined in code

## Cost Optimization

### Resource Optimization

- Use minimum required CPU/memory
- Set appropriate concurrency limits
- Configure auto-scaling properly

### Monitoring Costs

```bash
# Check service costs
gcloud alpha billing budgets list

# Monitor usage
gcloud run services list --region us-central1
```

## Integration Testing

After deployment, test all endpoints:

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe quantai-backend --region=us-central1 --format="value(status.url)")

# Test health endpoint
curl $SERVICE_URL/health

# Test API info
curl $SERVICE_URL/api

# Test authentication flow (with frontend)
```

## Production Checklist

- [ ] All secrets properly configured in Secret Manager
- [ ] Service account with minimal required permissions
- [ ] Contract addresses updated with actual deployment addresses
- [ ] Frontend updated with backend URL
- [ ] CORS configured for frontend domain
- [ ] Monitoring and alerting set up
- [ ] Health checks responding
- [ ] All API endpoints tested
- [ ] Error handling tested
- [ ] Rate limiting verified
- [ ] Logs aggregation working
- [ ] Backup strategy in place

## Support and Monitoring

### Key Metrics to Monitor

- Request latency (target: <500ms)
- Error rate (target: <1%)
- Memory usage (target: <80% of allocation)
- CPU usage (target: <70% of allocation)
- Concurrent connections

### Alerting Thresholds

Set up alerts for:
- Error rate > 5%
- Latency > 1000ms
- Memory usage > 90%
- Failed deployments

This completes the backend deployment configuration. The service will be accessible at the Cloud Run URL and ready to handle MetaMask authentication and smart contract interactions.
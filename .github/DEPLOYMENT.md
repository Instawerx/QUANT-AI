# CI/CD Deployment Guide

## Overview

This project uses GitHub Actions for continuous integration and deployment to Firebase Hosting. The CI/CD pipeline automatically builds and deploys your Next.js application when changes are pushed to the `main` branch.

## GitHub Secrets Setup

To enable automated deployments, you need to configure the following secret in your GitHub repository:

### Required Secret

1. **FIREBASE_SERVICE_ACCOUNT**
   - This is your Firebase service account JSON key
   - Used for authenticating GitHub Actions to deploy to Firebase

### How to Get Your Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-5150539807-1dba3`
3. Click the gear icon (⚙️) → **Project Settings**
4. Navigate to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Copy the entire contents of the JSON file

### How to Add the Secret to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Paste the entire JSON content from the service account file
6. Click **Add secret**

## Workflow Files

### Active Workflow

- **`.github/workflows/firebase-deploy.yml`** - Main deployment workflow
  - Runs quality checks (linting, smart contract tests)
  - Builds the Next.js application
  - Deploys to Firebase Hosting on push to `main`
  - Creates preview deployments for pull requests

### Disabled Workflows

The following workflows have been disabled (renamed to `.disabled`) because they had configuration issues:

- `.github/workflows/deploy.yml.disabled` - Old Google Cloud Run deployment
- `.github/workflows/ci-cd.yml.disabled` - Complex multi-stage pipeline

These can be re-enabled and fixed if needed in the future.

## Deployment Process

### Automatic Deployment (Main Branch)

When you push to the `main` branch:

1. **Quality Checks** job runs:
   - Installs dependencies
   - Runs ESLint (non-blocking)
   - Compiles smart contracts
   - Runs smart contract tests

2. **Build** job runs:
   - Builds the Next.js application
   - Creates static export in `out/` directory
   - Uploads build artifacts

3. **Deploy** job runs:
   - Rebuilds the application
   - Deploys to Firebase Hosting (live channel)

### Preview Deployments (Pull Requests)

When you create a pull request:

1. Quality checks and build jobs run
2. A temporary preview deployment is created
3. Preview URL is posted as a comment on the PR
4. Preview expires after 7 days

### Manual Deployment

You can also trigger deployments manually:

1. Go to **Actions** tab in GitHub
2. Select **Firebase Deploy** workflow
3. Click **Run workflow**
4. Select the branch
5. Click **Run workflow** button

## Local Deployment

To deploy directly from your local machine (bypasses CI/CD):

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Troubleshooting

### Build Failures

If the build fails in CI/CD:

1. Check the Actions tab for detailed error logs
2. Try running `npm run build` locally to reproduce the issue
3. Ensure all environment variables are properly set

### TypeScript Errors

The project is configured to ignore TypeScript errors during build (`ignoreBuildErrors: true`), but you can check for type issues:

```bash
npm run typecheck
```

Note: The backend directory is excluded from TypeScript checks.

### Firebase Authentication Errors

If deployment fails with authentication errors:

1. Verify the `FIREBASE_SERVICE_ACCOUNT` secret is correctly set
2. Ensure the service account has the necessary permissions:
   - Firebase Hosting Admin
   - Cloud Datastore User (for Firestore)

### Smart Contract Test Failures

If contract tests fail:

```bash
# Run tests locally
npm run test

# Run with detailed output
npx hardhat test --verbose

# Generate coverage report
npm run test:coverage
```

## Firebase Hosting Configuration

The project uses the following Firebase Hosting configuration (`firebase.json`):

- **Public directory**: `out/` (Next.js static export)
- **Rewrites**: All routes redirect to `/index.html` (SPA behavior)
- **Headers**: Security headers and caching configured
- **Project ID**: `studio-5150539807-1dba3`

## Next Steps

1. ✅ Add `FIREBASE_SERVICE_ACCOUNT` secret to GitHub
2. ✅ Push to `main` branch to trigger first deployment
3. ✅ Monitor the Actions tab for deployment progress
4. ✅ Visit your Firebase Hosting URL to see the deployed site

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

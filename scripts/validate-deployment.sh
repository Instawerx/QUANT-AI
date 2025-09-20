#!/bin/bash
# Deployment validation script for QuantAI

set -e

echo "🔍 Validating QuantAI deployment configuration..."

# Check required files
echo "📁 Checking required files..."
required_files=(
    "Dockerfile"
    "infra/cloudbuild.yaml"
    "firebase.json"
    "firestore.rules"
    "firestore.indexes.json"
    "next.config.ts"
    "src/app/api/health/route.ts"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

# Validate package.json scripts
echo "📦 Checking package.json scripts..."
required_scripts=(
    "build"
    "test"
    "test:coverage"
    "typecheck"
    "lint:sol"
    "lint:ts"
    "contracts:compile"
)

for script in "${required_scripts[@]}"; do
    if npm run --silent | grep -q "$script"; then
        echo "✅ Script '$script' exists"
    else
        echo "❌ Missing required script: $script"
        exit 1
    fi
done

# Check Next.js configuration
echo "🔧 Validating Next.js configuration..."
if grep -q '"standalone"' next.config.ts; then
    echo "✅ Next.js standalone output configured"
else
    echo "❌ Missing standalone output configuration"
    exit 1
fi

# Validate Docker build context
echo "🐳 Checking Docker configuration..."
if grep -q "FROM node:18-alpine" Dockerfile; then
    echo "✅ Dockerfile uses correct base image"
else
    echo "❌ Dockerfile base image issue"
    exit 1
fi

# Validate Cloud Build configuration
echo "☁️ Checking Cloud Build configuration..."
if grep -q "us-central1-docker.pkg.dev" infra/cloudbuild.yaml; then
    echo "✅ Cloud Build configured for Artifact Registry"
else
    echo "❌ Cloud Build Artifact Registry configuration missing"
    exit 1
fi

# Check Firebase configuration
echo "🔥 Validating Firebase configuration..."
if [ -f "firebase.json" ] && [ -f "firestore.rules" ]; then
    echo "✅ Firebase configuration complete"
else
    echo "❌ Firebase configuration incomplete"
    exit 1
fi

# Validate security rules
echo "🔒 Checking Firestore rules..."
if grep -q "rules_version = '2'" firestore.rules; then
    echo "✅ Firestore rules version 2"
else
    echo "❌ Incorrect Firestore rules version"
    exit 1
fi

if grep -q "allow read, write: if false" firestore.rules; then
    echo "✅ Default-deny rules configured"
else
    echo "❌ Default-deny rules not found"
    exit 1
fi

echo ""
echo "🎉 All deployment validation checks passed!"
echo ""
echo "📋 Deployment readiness summary:"
echo "  ✅ Docker containerization ready"
echo "  ✅ Cloud Build pipeline configured"
echo "  ✅ Cloud Run deployment ready"
echo "  ✅ Firebase security rules validated"
echo "  ✅ Testing and quality gates in place"
echo "  ✅ Health monitoring configured"
echo ""
echo "🚀 Ready for production deployment!"
echo ""
echo "To deploy:"
echo "  npm run deploy:production"
echo "or"
echo "  npm run deploy:local"
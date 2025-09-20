#!/bin/bash

# Setup uptime checks and alerting for QuantAI Cloud Run services
# This script creates uptime checks for all Cloud Run services and sets up alerting

set -e

PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"quantai-platform"}
REGION=${REGION:-"us-central1"}
NOTIFICATION_CHANNEL=""

echo "Setting up uptime checks and alerting for project: $PROJECT_ID"

# Function to create notification channel for email alerts
create_notification_channel() {
    local email="${1:-admin@quantai.com}"

    echo "Creating notification channel for email: $email"

    NOTIFICATION_CHANNEL=$(gcloud alpha monitoring channels create \
        --display-name="QuantAI Admin Email" \
        --type=email \
        --channel-labels=email_address="$email" \
        --format="value(name)")

    echo "Created notification channel: $NOTIFICATION_CHANNEL"
}

# Function to create uptime check
create_uptime_check() {
    local service_name="$1"
    local path="${2:-/}"
    local timeout="${3:-10s}"

    echo "Creating uptime check for service: $service_name"

    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $service_name \
        --region=$REGION \
        --format="value(status.url)")

    if [ -z "$SERVICE_URL" ]; then
        echo "Warning: Could not find URL for service $service_name"
        return 1
    fi

    # Create the uptime check
    cat > /tmp/uptime-check-$service_name.yaml << EOF
displayName: "QuantAI $service_name Uptime Check"
monitoredResource:
  type: uptime_url
  labels:
    host: $(echo $SERVICE_URL | sed 's|https://||' | sed 's|http://||' | cut -d'/' -f1)
httpCheck:
  path: "$path"
  port: 443
  useSsl: true
  requestMethod: GET
  validateSsl: true
period: 60s
timeout: $timeout
contentMatchers:
  - content: ""
    matcher: NOT_MATCHES_REGEX
selectedRegions:
  - USA
  - EUROPE
  - ASIA_PACIFIC
EOF

    gcloud monitoring uptime create-config /tmp/uptime-check-$service_name.yaml
    rm /tmp/uptime-check-$service_name.yaml

    echo "Created uptime check for $service_name at $SERVICE_URL$path"
}

# Function to create alerting policy
create_alert_policy() {
    local policy_name="$1"
    local condition_filter="$2"
    local threshold="$3"
    local duration="${4:-300s}"

    echo "Creating alert policy: $policy_name"

    cat > /tmp/alert-policy-$policy_name.yaml << EOF
displayName: "QuantAI $policy_name Alert"
documentation:
  content: "Alert for QuantAI $policy_name monitoring"
  mimeType: "text/markdown"
conditions:
  - displayName: "$policy_name condition"
    conditionThreshold:
      filter: '$condition_filter'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: $threshold
      duration: $duration
      aggregations:
        - alignmentPeriod: 60s
          perSeriesAligner: ALIGN_RATE
          crossSeriesReducer: REDUCE_MEAN
          groupByFields:
            - resource.label.service_name
notificationChannels:
  - $NOTIFICATION_CHANNEL
alertStrategy:
  autoClose: 86400s
enabled: true
EOF

    gcloud alpha monitoring policies create /tmp/alert-policy-$policy_name.yaml
    rm /tmp/alert-policy-$policy_name.yaml

    echo "Created alert policy for $policy_name"
}

# Main execution
main() {
    # Check if gcloud is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        echo "Error: Please authenticate with gcloud first"
        echo "Run: gcloud auth login"
        exit 1
    fi

    # Set the project
    gcloud config set project $PROJECT_ID

    # Enable required APIs
    echo "Enabling required APIs..."
    gcloud services enable monitoring.googleapis.com
    gcloud services enable cloudresourcemanager.googleapis.com

    # Create notification channel
    read -p "Enter email address for alerts (default: admin@quantai.com): " EMAIL
    EMAIL=${EMAIL:-admin@quantai.com}
    create_notification_channel "$EMAIL"

    # Create uptime checks for main services
    echo "Creating uptime checks..."

    # Main application
    create_uptime_check "quantai-app" "/health" "10s"

    # API endpoints
    create_uptime_check "quantai-api" "/api/health" "10s"

    # Create alert policies
    echo "Creating alert policies..."

    # High error rate alert
    create_alert_policy "High Error Rate" \
        'resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_count" AND metric.label.response_code_class!="2xx"' \
        "0.05" \
        "300s"

    # High latency alert
    create_alert_policy "High Latency" \
        'resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_latencies"' \
        "2000" \
        "300s"

    # Low uptime alert
    create_alert_policy "Service Down" \
        'resource.type="uptime_url" AND metric.type="monitoring.googleapis.com/uptime_check/check_passed"' \
        "0.1" \
        "180s"

    # CPU utilization alert
    create_alert_policy "High CPU Usage" \
        'resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/container/cpu/utilizations"' \
        "0.8" \
        "300s"

    # Memory utilization alert
    create_alert_policy "High Memory Usage" \
        'resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/container/memory/utilizations"' \
        "0.9" \
        "300s"

    echo "✅ Uptime checks and alerting setup completed!"
    echo ""
    echo "You can view your monitoring setup at:"
    echo "- Uptime checks: https://console.cloud.google.com/monitoring/uptime"
    echo "- Alert policies: https://console.cloud.google.com/monitoring/alerting/policies"
    echo "- Dashboards: https://console.cloud.google.com/monitoring/dashboards"
    echo ""
    echo "Notification channel created: $NOTIFICATION_CHANNEL"
}

# Run the main function
main "$@"
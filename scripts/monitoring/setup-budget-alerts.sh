#!/bin/bash

# Setup budget alerts for QuantAI Google Cloud project
# This script creates budget alerts to monitor monthly spending

set -e

PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"quantai-platform"}
BILLING_ACCOUNT_ID=""

echo "Setting up budget alerts for project: $PROJECT_ID"

# Function to get billing account ID
get_billing_account() {
    echo "Getting billing account for project..."

    # Get the billing account ID for the project
    BILLING_ACCOUNT_ID=$(gcloud beta billing projects describe $PROJECT_ID \
        --format="value(billingAccountName)" | sed 's|.*accounts/||')

    if [ -z "$BILLING_ACCOUNT_ID" ]; then
        echo "Error: No billing account found for project $PROJECT_ID"
        echo "Please ensure billing is enabled for this project"
        exit 1
    fi

    echo "Found billing account: $BILLING_ACCOUNT_ID"
}

# Function to create notification channel for budget alerts
create_budget_notification_channel() {
    local email="${1:-admin@quantai.com}"

    echo "Creating notification channel for budget alerts: $email"

    BUDGET_NOTIFICATION_CHANNEL=$(gcloud alpha monitoring channels create \
        --display-name="QuantAI Budget Alerts" \
        --type=email \
        --channel-labels=email_address="$email" \
        --format="value(name)")

    echo "Created budget notification channel: $BUDGET_NOTIFICATION_CHANNEL"
}

# Function to create budget
create_budget() {
    local budget_name="$1"
    local amount="$2"
    local currency="${3:-USD}"
    local email="${4:-admin@quantai.com}"

    echo "Creating budget: $budget_name with amount: $amount $currency"

    cat > /tmp/budget-$budget_name.yaml << EOF
displayName: "QuantAI $budget_name Budget"
budgetFilter:
  projects:
    - "projects/$PROJECT_ID"
amount:
  specifiedAmount:
    currencyCode: "$currency"
    units: "$amount"
thresholdRules:
  - thresholdPercent: 0.5
    spendBasis: CURRENT_SPEND
  - thresholdPercent: 0.8
    spendBasis: CURRENT_SPEND
  - thresholdPercent: 0.9
    spendBasis: CURRENT_SPEND
  - thresholdPercent: 1.0
    spendBasis: CURRENT_SPEND
  - thresholdPercent: 1.2
    spendBasis: FORECASTED_SPEND
allUpdatesRule:
  pubsubTopic: ""
  schemaVersion: "1.0"
  monitoringNotificationChannels:
    - "$BUDGET_NOTIFICATION_CHANNEL"
  disableDefaultIamRecipients: false
EOF

    gcloud billing budgets create \
        --billing-account=$BILLING_ACCOUNT_ID \
        --budget-from-file=/tmp/budget-$budget_name.yaml

    rm /tmp/budget-$budget_name.yaml

    echo "Created budget: $budget_name"
}

# Function to create service-specific budgets
create_service_budgets() {
    local email="$1"

    echo "Creating service-specific budgets..."

    # Cloud Run budget
    cat > /tmp/budget-cloudrun.yaml << EOF
displayName: "QuantAI Cloud Run Budget"
budgetFilter:
  projects:
    - "projects/$PROJECT_ID"
  services:
    - "services/run.googleapis.com"
amount:
  specifiedAmount:
    currencyCode: "USD"
    units: "100"
thresholdRules:
  - thresholdPercent: 0.8
    spendBasis: CURRENT_SPEND
  - thresholdPercent: 1.0
    spendBasis: CURRENT_SPEND
allUpdatesRule:
  monitoringNotificationChannels:
    - "$BUDGET_NOTIFICATION_CHANNEL"
  disableDefaultIamRecipients: false
EOF

    gcloud billing budgets create \
        --billing-account=$BILLING_ACCOUNT_ID \
        --budget-from-file=/tmp/budget-cloudrun.yaml

    # Cloud Build budget
    cat > /tmp/budget-cloudbuild.yaml << EOF
displayName: "QuantAI Cloud Build Budget"
budgetFilter:
  projects:
    - "projects/$PROJECT_ID"
  services:
    - "services/cloudbuild.googleapis.com"
amount:
  specifiedAmount:
    currencyCode: "USD"
    units: "50"
thresholdRules:
  - thresholdPercent: 0.8
    spendBasis: CURRENT_SPEND
  - thresholdPercent: 1.0
    spendBasis: CURRENT_SPEND
allUpdatesRule:
  monitoringNotificationChannels:
    - "$BUDGET_NOTIFICATION_CHANNEL"
  disableDefaultIamRecipients: false
EOF

    gcloud billing budgets create \
        --billing-account=$BILLING_ACCOUNT_ID \
        --budget-from-file=/tmp/budget-cloudbuild.yaml

    # Firestore budget
    cat > /tmp/budget-firestore.yaml << EOF
displayName: "QuantAI Firestore Budget"
budgetFilter:
  projects:
    - "projects/$PROJECT_ID"
  services:
    - "services/firestore.googleapis.com"
amount:
  specifiedAmount:
    currencyCode: "USD"
    units: "30"
thresholdRules:
  - thresholdPercent: 0.8
    spendBasis: CURRENT_SPEND
  - thresholdPercent: 1.0
    spendBasis: CURRENT_SPEND
allUpdatesRule:
  monitoringNotificationChannels:
    - "$BUDGET_NOTIFICATION_CHANNEL"
  disableDefaultIamRecipients: false
EOF

    gcloud billing budgets create \
        --billing-account=$BILLING_ACCOUNT_ID \
        --budget-from-file=/tmp/budget-firestore.yaml

    # Secret Manager budget
    cat > /tmp/budget-secretmanager.yaml << EOF
displayName: "QuantAI Secret Manager Budget"
budgetFilter:
  projects:
    - "projects/$PROJECT_ID"
  services:
    - "services/secretmanager.googleapis.com"
amount:
  specifiedAmount:
    currencyCode: "USD"
    units: "10"
thresholdRules:
  - thresholdPercent: 0.8
    spendBasis: CURRENT_SPEND
  - thresholdPercent: 1.0
    spendBasis: CURRENT_SPEND
allUpdatesRule:
  monitoringNotificationChannels:
    - "$BUDGET_NOTIFICATION_CHANNEL"
  disableDefaultIamRecipients: false
EOF

    gcloud billing budgets create \
        --billing-account=$BILLING_ACCOUNT_ID \
        --budget-from-file=/tmp/budget-secretmanager.yaml

    # Clean up temporary files
    rm -f /tmp/budget-*.yaml

    echo "Created service-specific budgets"
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
    gcloud services enable cloudbilling.googleapis.com
    gcloud services enable monitoring.googleapis.com

    # Get billing account
    get_billing_account

    # Get email for notifications
    read -p "Enter email address for budget alerts (default: admin@quantai.com): " EMAIL
    EMAIL=${EMAIL:-admin@quantai.com}

    # Create notification channel
    create_budget_notification_channel "$EMAIL"

    # Create main project budget
    echo "Creating main project budget..."
    read -p "Enter monthly budget limit in USD (default: 500): " BUDGET_AMOUNT
    BUDGET_AMOUNT=${BUDGET_AMOUNT:-500}

    create_budget "Monthly" "$BUDGET_AMOUNT" "USD" "$EMAIL"

    # Create service-specific budgets
    create_service_budgets "$EMAIL"

    # Create development budget (lower threshold)
    echo "Creating development budget..."
    create_budget "Development" "100" "USD" "$EMAIL"

    echo "✅ Budget alerts setup completed!"
    echo ""
    echo "You can view your budgets at:"
    echo "https://console.cloud.google.com/billing/$BILLING_ACCOUNT_ID/budgets"
    echo ""
    echo "Budget notification channel created: $BUDGET_NOTIFICATION_CHANNEL"
    echo "Budgets created:"
    echo "- Monthly Budget: $BUDGET_AMOUNT USD"
    echo "- Development Budget: 100 USD"
    echo "- Cloud Run Budget: 100 USD"
    echo "- Cloud Build Budget: 50 USD"
    echo "- Firestore Budget: 30 USD"
    echo "- Secret Manager Budget: 10 USD"
    echo ""
    echo "Alerts will be sent to: $EMAIL"
    echo "Thresholds: 50%, 80%, 90%, 100% of current spend, and 120% of forecasted spend"
}

# Run the main function
main "$@"
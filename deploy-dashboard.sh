#!/bin/bash

# ============================================================
#  NOC CloudWatch Dashboard — URL Shortener Production
#  Principal DevOps Engineer Edition
# ============================================================

DASHBOARD_NAME="URL-Shortener-Production-Telemetry"
REGION="us-east-1"
WEB_INSTANCE_ID="i-0b377383592c91dea"
DB_INSTANCE_ID="i-09de86848b19b6370"   # <--- REPLACE THIS

# Validate DB ID is set
if [[ "$DB_INSTANCE_ID" == *"XXX"* ]]; then
  echo "❌ ERROR: Please set DB_INSTANCE_ID before deploying."
  exit 1
fi

echo "🔧 Substituting instance IDs..."

# Substitute placeholders into the JSON template
sed \
  -e "s/i-0b377383592c91dea/$WEB_INSTANCE_ID/g" \
  -e "s/i-09de86848b19b6370/$DB_INSTANCE_ID/g" \
  prod-dashboard.json > prod-dashboard-final.json

echo "🚀 Pushing dashboard to AWS CloudWatch ($REGION)..."

aws cloudwatch put-dashboard \
  --region "$REGION" \
  --dashboard-name "$DASHBOARD_NAME" \
  --dashboard-body file://prod-dashboard-final.json

if [ $? -eq 0 ]; then
  echo "✅ Dashboard deployed successfully!"
  echo "🔗 https://$REGION.console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards/dashboard/$DASHBOARD_NAME"
else
  echo "❌ Deployment failed. Check your AWS credentials and permissions."
  exit 1
fi
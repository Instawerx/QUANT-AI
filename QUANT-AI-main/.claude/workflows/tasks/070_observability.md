Agent: sre

Steps:
- Integrate OpenTelemetry into the API services to export traces and metrics to Google Cloud Monitoring.
- Configure structured logging for all services, sending logs to Cloud Logging.
- Set up uptime checks for the Cloud Run services and configure alerting for high error rates and latency.
- Create budget alerts to monitor monthly spending on Google Cloud.

Acceptance:
- Telemetry data is visible in Cloud Monitoring dashboards.
- Uptime checks are active and alerts have been defined for error rates and latency.

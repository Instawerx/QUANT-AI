import { NodeSDK } from '@opentelemetry/sdk-node';
import { autoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { MetricExporter } from '@google-cloud/opentelemetry-cloud-monitoring-exporter';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const serviceName = 'quantai';
const serviceVersion = process.env.npm_package_version || '1.0.0';

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
  traceExporter: new TraceExporter({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  }),
  instrumentations: [
    autoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false, // Disable file system instrumentation to reduce noise
      },
    }),
  ],
});

// Initialize metrics
const metricExporter = new MetricExporter({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
});

const meterProvider = new MeterProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
  }),
  readers: [
    new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 60000, // Export every 60 seconds
    }),
  ],
});

// Start the SDK
export function startTelemetry() {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_TELEMETRY === 'true') {
    try {
      sdk.start();
      console.log('OpenTelemetry started successfully');
    } catch (error) {
      console.error('Error starting OpenTelemetry:', error);
    }
  }
}

// Graceful shutdown
export function shutdownTelemetry() {
  return sdk.shutdown();
}

// Export meter for custom metrics
export const meter = meterProvider.getMeter(serviceName, serviceVersion);

// Custom metrics
export const customMetrics = {
  // API request counter
  apiRequestCounter: meter.createCounter('api_requests_total', {
    description: 'Total number of API requests',
  }),

  // API request duration histogram
  apiRequestDuration: meter.createHistogram('api_request_duration_ms', {
    description: 'API request duration in milliseconds',
    unit: 'ms',
  }),

  // Trading operation counter
  tradingOperationCounter: meter.createCounter('trading_operations_total', {
    description: 'Total number of trading operations',
  }),

  // Active user gauge
  activeUsersGauge: meter.createUpDownCounter('active_users', {
    description: 'Number of active users',
  }),

  // Token transfer counter
  tokenTransferCounter: meter.createCounter('token_transfers_total', {
    description: 'Total number of token transfers',
  }),

  // Wallet connection counter
  walletConnectionCounter: meter.createCounter('wallet_connections_total', {
    description: 'Total number of wallet connections',
  }),
};
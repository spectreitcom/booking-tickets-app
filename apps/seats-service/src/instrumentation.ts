import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

import {
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

import { resourceFromAttributes } from '@opentelemetry/resources';

import { PrismaInstrumentation } from '@prisma/instrumentation';

import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';

import { config } from 'dotenv';

config();

// Jaeger's OTLP receiver only implements the traces service, so traces are
// pushed to Jaeger via OTLP while metrics are exposed on a local /metrics
// endpoint for Prometheus to scrape (pull model).
const otelEndpoint =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318';

const traceExporter = new OTLPTraceExporter({
  url: `${otelEndpoint}/v1/traces`,
});

const metricReader = new PrometheusExporter({
  port: Number(process.env.OTEL_METRICS_PORT ?? 9464),
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'unknown-service',

    [ATTR_SERVICE_VERSION]: process.env.APP_VERSION ?? 'development',

    [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: process.env.NODE_ENV ?? 'development',
  }),

  traceExporter,

  metricReader,

  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),

    new PrismaInstrumentation(),
    new AmqplibInstrumentation(),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().catch((error: unknown) => {
    console.error('Error shutting down OpenTelemetry SDK', error);
  });
});

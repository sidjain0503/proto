const {
  LANGFUSE_SECRET_KEY,
  LANGFUSE_PUBLIC_KEY,
  LANGFUSE_BASE_URL,
} = require("./config");
const { createLogger } = require("./lib/logger");

const log = createLogger("tracing");
const isLangfuseTracingEnabled = !!LANGFUSE_SECRET_KEY && !!LANGFUSE_PUBLIC_KEY;

if (!isLangfuseTracingEnabled) {
  log.info("Langfuse tracing disabled");
  module.exports = { langfuseSpanProcessor: null, isLangfuseTracingEnabled: false };
} else {
  const { NodeSDK } = require("@opentelemetry/sdk-node");
  const { LangfuseSpanProcessor } = require("@langfuse/otel");

  const langfuseSpanProcessor = new LangfuseSpanProcessor();
  const sdk = new NodeSDK({ spanProcessors: [langfuseSpanProcessor] });
  sdk.start();

  const shutdown = async () => {
    try {
      await langfuseSpanProcessor.forceFlush();
      await sdk.shutdown();
    } catch (error) {
      log.error({ err: error }, "Langfuse shutdown failed");
    }
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  log.info(
    { baseUrl: LANGFUSE_BASE_URL || "https://cloud.langfuse.com" },
    "Langfuse tracing enabled"
  );

  module.exports = { langfuseSpanProcessor, isLangfuseTracingEnabled: true };
}

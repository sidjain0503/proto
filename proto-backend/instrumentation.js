const {
  LANGFUSE_SECRET_KEY,
  LANGFUSE_PUBLIC_KEY,
  LANGFUSE_BASE_URL,
} = require("./config");

const isLangfuseTracingEnabled = !!LANGFUSE_SECRET_KEY && !!LANGFUSE_PUBLIC_KEY;

if (!isLangfuseTracingEnabled) {
  console.log(
    "Langfuse tracing disabled (set LANGFUSE_SECRET_KEY and LANGFUSE_PUBLIC_KEY to enable)"
  );
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
      console.error("Langfuse shutdown error:", error.message);
    }
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  console.log(
    `Langfuse tracing enabled → ${LANGFUSE_BASE_URL || "https://cloud.langfuse.com"}`
  );

  module.exports = { langfuseSpanProcessor, isLangfuseTracingEnabled: true };
}

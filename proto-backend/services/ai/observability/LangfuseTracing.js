const { isLangfuseTracingEnabled } = require("../../../instrumentation");

let langfuseTracingSdk = null;

const getTracingModule = () => {
  if (!isLangfuseTracingEnabled) return null;
  if (!langfuseTracingSdk) {
    langfuseTracingSdk = require("@langfuse/tracing");
  }
  return langfuseTracingSdk;
};

const propagateTraceAttributes = async (traceAttributes, callback) => {
  const tracingModule = getTracingModule();
  if (!tracingModule) return callback();
  return tracingModule.propagateAttributes(traceAttributes, callback);
};

const traceActiveObservation = async (observationName, callback, options = {}) => {
  const tracingModule = getTracingModule();
  if (!tracingModule) return callback(null);
  return tracingModule.startActiveObservation(
    observationName,
    async (observation) => callback(observation),
    options
  );
};

const buildTokenUsageDetails = (usage = {}) => ({
  input: usage.prompt_tokens || 0,
  output: usage.completion_tokens || 0,
  total: usage.total_tokens || 0,
});

module.exports = {
  isTracingEnabled: () => isLangfuseTracingEnabled,
  propagateTraceAttributes,
  traceActiveObservation,
  buildTokenUsageDetails,
};
